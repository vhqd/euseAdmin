import euNavi from "@/components/navi";
import service from '../../service'
import { getDate } from '../../untils/base.js'
import store from "../../store";
import qs from 'qs'

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
      addoredit: true,
      page: {
        pagesizes: [12, 25, 50, 100],
        pagesize: 12,
        pagetotal: 50
      },
      formInline: {
        user: "",
        parentId: ""
      },
      dialogFormVisible: false,
      ruleForm: {
        categoryname: '',
        isparent: false,
        parentId: "",
        desc: ""
      },
      rules: {
        categoryname: [
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
    },
    firstCate() {
      return store.getters.getFirstCategory.slice(1, store.getters.getFirstCategory.length)
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
        this.addoredit = true;
        this.isreset = true;
        this.categorytitle = "添加分类";
        this.categoryBut = "立即创建";
      } else if (handle == "edit") {
        this.categorytitle = "编辑分类";
        this.categoryBut = "修改编辑";
        this.isreset = false;
        this.addoredit = false;
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
      this.$confirm("此操作将永久删除该栏目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let categorys = this.multipleSelection;
          this.deletcategory(index, categorys)
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
    deletcategory(index, categorys) {

      service
        .deletecategory(categorys)
        .then(res => {
          console.log(res);
          let category = this.categorys
          for (let i = 0; i < categorys.length; i++) {
            let _id = categorys[i]._id
            for (let j = 0; j < category.length; j++) {
              if (_id == category[j]._id) {
                this.categorys.splice(j, 1)
              }
            }
          }
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(err => {
          console.log(err);
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
          if (this.addoredit) {//添加栏目
            service.addCategory(this.ruleForm).then((res) => {
              this.dialogFormVisible = false;
              this.getcategorys();
              this.$message({
                type: "success",
                message: "添加成功!"
              });
              console.log(res.data);
            }).catch((err) => {
              console.log(err);
            })
          } else {//编辑栏目
              console.log('编辑栏目');
              service.editcategory(this.ruleForm).then((res) => {
                this.dialogFormVisible = false;
                this.getcategorys();
                this.$message({
                  type: "success",
                  message: "添加成功!"
                });
                console.log(res.data);
              }).catch((err) => {
                console.log(err);
              })
          }

        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getcategorys() {
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
    resetForm() {
      /* this.$refs[formName].resetFields(); */
      this.ruleForm = {
        categoryname: "",
        parentId: "",
        isparent: false,
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
    this.getcategorys()
  },
  beforeCreate() { }, //生命周期 - 创建之前
  beforeMount() { }, //生命周期 - 挂载之前
  beforeUpdate() { }, //生命周期 - 更新之前
  updated() { }, //生命周期 - 更新之后
  beforeDestroy() { }, //生命周期 - 销毁之前
  destroyed() { }, //生命周期 - 销毁完成
  activated() { } //如果页面有keep-alive缓存功能，这个函数会触发
};