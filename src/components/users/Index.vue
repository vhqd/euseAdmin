<template>
  <div class="category">
    <eu-navi></eu-navi>
    <el-row class="handbt">
      <el-button type="success" @click="addEdit('add')">添加用户</el-button>
      <el-button type="danger" @click="deletList(true)">删除用户</el-button>
    </el-row>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="搜索">
        <el-input v-model="formInline.user" placeholder="请输入关键词"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="nowuserData"
      style="width: 100%"
      ref="multipleTable"
      :default-sort="{prop: 'date', order: 'descending'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="creatat" label="创建日期" sortable width="180"></el-table-column>
      <el-table-column prop="username" label="用户名" sortable width="180"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row,'edit')"
            :disabled="scope.row.isadmin"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row ,false)"
            :disabled="scope.row.isadmin"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="categorytitle" :visible.sync="dialogFormVisible">
      <el-form :model="user" :rules="rules" ref="user" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item label="用名密码" prop="password">
          <el-input v-model="user.password" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('user')">{{categoryBut}}</el-button>
          <el-button @click="resetForm('user')" v-if="isreset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="page.pagesizes"
      :page-size="page.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.pagetotal"
      style="float:right;margin-top:5px;"
    ></el-pagination>
  </div>
</template>

<script>
import euNavi from "@/components/navi";
import service from "@/service";
import { getDate } from "@/untils/base.js";
import qs from "qs";

export default {
  components: {
    euNavi
  },
  data() {
    return {
      categorytitle: "添加分类",
      categoryBut: "立即创建",
      currentPage: 1,
      input: "",
      isreset: true,
      page: {
        pagesizes: [2, 20, 50, 100],
        pagesize: 2,
        pagetotal: 400
      },
      formInline: {
        user: "",
        region: ""
      },
      dialogFormVisible: false,
      user: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          { min: 3, max: 18, message: "长度在 3 到 18 个字符", trigger: "blur" }
        ]
      },
      multipleSelection: [],
      userlist: []
    };
  },
  computed: {
    nowuserData() {
      return (
        this.userlist.slice(
          (this.currentPage - 1) * this.page.pagesize,
          this.currentPage * this.page.pagesize
        ) || []
      );
    }
  },
  watch: {},
  methods: {
    addEdit(handle) {
      this.dialogFormVisible = true;
      this.addEditTitle(handle);
    },
    handleEdit(index, row, handle) {
      this.addEditTitle(handle);
      this.dialogFormVisible = true;
      this.user = row;
      console.log(index, row);
    },
    addEditTitle(handle) {
      if (handle == "add") {
        this.resetForm();
        this.isreset = true;
        this.categorytitle = "添加用户";
        this.categoryBut = "立即创建";
      } else if (handle == "edit") {
        this.categorytitle = "编辑用户";
        this.categoryBut = "修改用户";
        this.isreset = false;
      }
    },
    formatter(row, column) {
      return row.address;
    },
    onSubmit() {
      console.log("submit!");
    },
    handleSizeChange(val) {
      this.page.pagesize = val
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val
      console.log(`当前页: ${val}`);
    },
    handleDelete(index, row, batch) {
      this.clearBatch();
      this.multipleSelection.push(row);
      /* this.$refs.multipleTable.toggleRowSelection(row); */
      console.log(this.multipleSelection);
      this.deletList(index, batch);
    },
    deletList(index, batch) {
      if (batch) {
        if (this.multipleSelection == 0) {
          this.$message({
            type: "info",
            message: "请选择需要删除的数据"
          });
        } else {
          this.deletOpen(index, batch);
        }
      } else {
        this.deletOpen(index, batch);
      }
    },
    deletOpen(index, batch) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          /* if (!batch) {
            this.clearBatch();
          } */
          let user = this.multipleSelection[0];
          service
            .deleteuser(qs.stringify(user))
            .then(res => {
              console.log(res);
              this.userlist.splice(index, 1);
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          if (!batch) {
            this.clearBatch();
          }
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    clearBatch() {
      this.multipleSelection.splice(0, this.multipleSelection.length);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.user);

          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      /* this.$refs[formName].resetFields(); */
      this.user = {
        username: "",
        password: ""
      };
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    /* this.page.pagetotal = this.userlist.length */
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    service
      .getusers()
      .then(res => {
        if (res.data.code == 200) {
          let datas = res.data.data.userlist;
          let newdata = datas.map((v, k) => {
            datas[k].creatat = getDate(v.creatat, false);
          });
          this.userlist = datas;
          /* let pagesizes = [];
          for (let i = 0; i < 3; i++) {
            pagesizes.push(pagesize * i + 5);
          } */
          /* this.$set(this.page, "pagesizes", pagesizes); */
          this.$set(this.page, "pagetotal", this.userlist.length);
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style  scoped>
.demo-form-inline {
  padding: 15px 10px 0px;
  float: left;
}
.handbt {
  float: right;
  padding: 15px 10px 0px;
}
.el-form-item {
  margin-bottom: 15px;
}
</style>