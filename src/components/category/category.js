import euNavi from "@/components/navi";
import service from '../../service'
import { getDate } from '../../untils/base.js'

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
        pagesizes: [12, 25, 50, 100],
        pagesize: 12,
        pagetotal: 50
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
      categorys: []
    };
  },
  computed: {
    nowCategorysData() {
      return (
        this.categorys.slice(
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
      this.page.pagesize = val
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val
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
    /* this.page.pagetotal = this.categorys.length */
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    service.getcategorys().then((res) => {
      let datas = res.data.data.category;
      datas.map((v, k) => {
        datas[k].creatat = getDate(v.creatat, false);
        if (datas[k].parents) {
          datas[k].parents = JSON.parse(datas[k].parents)
        }
      });
      this.categorys = datas;
      this.page.pagetotal = datas.length
    }).catch((err) => {
      console.log(err);
    })
  },
  beforeCreate() { }, //生命周期 - 创建之前
  beforeMount() { }, //生命周期 - 挂载之前
  beforeUpdate() { }, //生命周期 - 更新之前
  updated() { }, //生命周期 - 更新之后
  beforeDestroy() { }, //生命周期 - 销毁之前
  destroyed() { }, //生命周期 - 销毁完成
  activated() { } //如果页面有keep-alive缓存功能，这个函数会触发
};