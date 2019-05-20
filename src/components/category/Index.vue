<template>
  <div class="category">
    <eu-navi></eu-navi>
    <el-row class="handbt">
      <el-button type="success" @click="addEdit('add')">添加分类</el-button>
      <el-button type="danger" @click="deletList(true)">删除分类</el-button>
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
      :data="tableData"
      style="width: 100%"
      ref="multipleTable"
      :default-sort="{prop: 'date', order: 'descending'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="date" label="日期" sortable width="180"></el-table-column>
      <el-table-column prop="name" label="分类名称" sortable width="180"></el-table-column>
      <el-table-column prop="parents" label="父级分类"></el-table-column>
      <el-table-column prop="desc" label="分类描述"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row,'edit')">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row ,false)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="categorytitle" :visible.sync="dialogFormVisible">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="是否一级" prop="parent">
          <el-switch v-model="ruleForm.parent"></el-switch>
        </el-form-item>
        <el-form-item label="父级分类" prop="region" v-if="!ruleForm.parent">
          <el-select v-model="ruleForm.region" placeholder="请选择父级">
            <el-option label="前端" value="qianduan"></el-option>
            <el-option label="后台" value="houtai"></el-option>
            <el-option label="笔记" value="biji"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类描述" prop="desc">
          <el-input type="textarea" v-model="ruleForm.desc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">{{categoryBut}}</el-button>
          <el-button @click="resetForm('ruleForm')" v-if="isreset">重置</el-button>
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
        pagesizes: [10, 20, 50, 100],
        pagesize: 10,
        pagetotal: 400
      },
      formInline: {
        user: "",
        region: ""
      },
      dialogFormVisible: false,
      ruleForm: {
        name: "",
        region: "",
        parent: true,
        desc: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ]
      },
      multipleSelection: [],
      tableData: [
        {
          date: "2016-05-02",
          name: "父级",
          parent: true,
          parents: "无",
          desc: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "子集",
          parent: false,
          parents: `{
            date: "2016-05-02",
            name: "父级",
            parent: true,
            desc: "上海市普陀区金沙江路 1518 弄"
          }`,
          desc: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-02",
          name: "父级",
          parent: true,
          parents: "无",
          desc: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "子集",
          parent: false,
          parents: `{
            date: "2016-05-02",
            name: "父级",
            parent: true,
            desc: "上海市普陀区金沙江路 1518 弄"
          }`,
          desc: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-02",
          name: "父级",
          parent: true,
          parents: "无",
          desc: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "子集",
          parent: false,
          parents: `{
            date: "2016-05-02",
            name: "父级",
            parent: true,
            desc: "上海市普陀区金沙江路 1518 弄"
          }`,
          desc: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-02",
          name: "父级",
          parent: true,
          parents: "无",
          desc: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "子集",
          parent: false,
          parents: `{
            date: "2016-05-02",
            name: "父级",
            parent: true,
            desc: "上海市普陀区金沙江路 1518 弄"
          }`,
          desc: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-02",
          name: "父级",
          parent: true,
          parents: "无",
          desc: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "子集",
          parent: false,
          parents: `{
            date: "2016-05-02",
            name: "父级",
            parent: true,
            desc: "上海市普陀区金沙江路 1518 弄"
          }`,
          desc: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-02",
          name: "父级",
          parent: true,
          parents: "无",
          desc: "上海市普陀区金沙江路 1518 弄"
        }
      ]
    };
  },
  computed: {},
  watch: {},
  methods: {
    addEdit(handle) {
      this.dialogFormVisible = true;
      this.addEditTitle(handle);
    },
    handleEdit(index, row, handle) {
      this.addEditTitle(handle);
      this.dialogFormVisible = true;
      this.ruleForm = row;
      console.log(index, row);
    },
    addEditTitle(handle) {
      if (handle == "add") {
        this.resetForm();
        this.isreset = true;
        this.categorytitle = "添加分类";
        this.categoryBut = "立即创建";
      } else if (handle == "edit") {
        this.categorytitle = "编辑分类";
        this.categoryBut = "修改编辑";
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
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    handleDelete(index, row, batch) {
      this.clearBatch();
      this.multipleSelection.push(row);
      /* this.$refs.multipleTable.toggleRowSelection(row); */
      console.log(this.multipleSelection);
      this.deletList(batch);
    },
    deletList(batch) {
      if (batch) {
        if (this.multipleSelection == 0) {
          this.$message({
            type: "info",
            message: "请选择需要删除的数据"
          });
        } else {
          this.deletOpen(batch);
        }
      } else {
        this.deletOpen(batch);
      }
    },
    deletOpen(batch) {
      this.$confirm("此操作将永久删除该栏目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (!batch) {
            this.clearBatch();
          }
          this.$message({
            type: "success",
            message: "删除成功!"
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
          console.log(this.ruleForm);

          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      /* this.$refs[formName].resetFields(); */
      this.ruleForm = {
        name: "",
        region: "",
        parent: true,
        desc: ""
      };
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    /* this.page.pagetotal = this.tableData.length */
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
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