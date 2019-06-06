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
      loading: true,
      categorytitle: "添加栏目",
      categoryBut: "立即创建",
      currentPage: 1,
      valuelen: [],
      input: "",
      fileList:[],
      isreset: true,
      addoredit: true,
      allCate: [],
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
          { required: true, message: "请输入栏目名称", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
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
    /*  allCate(){
       return store.getters.getAllCate
     }, */
    firstCate() {
      return store.getters.getFirstCategory.slice(1, store.getters.getFirstCategory.length)
    }
  },
  watch: {},
  methods: {
    handlecateID(value) {
      this.ruleForm.parentId = value[value.length - 1]
      this.valuelen = value
      console.log(value);
    },
    handleSuccess(res, file, fileList){
      this.ruleForm.imgurl = res.ret_code
      this.fileList = fileList;
      console.log(res);
      console.log(file);
      console.log(fileList);
    },
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
        this.categorytitle = "添加栏目";
        this.categoryBut = "立即创建";
      } else if (handle == "edit") {
        this.categorytitle = "编辑栏目";
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
            message: res.data.msg
          });
        })
        .catch(err => {
          console.log(err);
          this.$message.error('失败', err);
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
            if (this.ruleForm.isparent) {
              this.ruleForm.level = 1;
            } else {
              let parentid = this.ruleForm.parentId;
              let vlen = this.valuelen.length
              if (vlen == 1) {
                for (let i = 0; i < this.allCate.length; i++) {
                  if (parentid == this.allCate[i]._id) {
                    this.ruleForm.level = this.allCate[i].level + 1;
                    break;
                  }
                }
              } else {
                for (let i = 0; i < this.allCate.length; i++) {
                  let child = this.allCate[i].children;
                  for (let j = 0; j < child.length; j++) {
                    if (child[j]._id == parentid) {
                      this.ruleForm.level = child[j].level + 1;
                      break;
                    }
                  }
                }
              }
            }
            service.addCategory(this.ruleForm).then((res) => {
              this.dialogFormVisible = false;
              this.getcategorys();
              this.$message({
                type: "success",
                message: res.data.msg
              });
              this.ruleForm.imgurl = '';
              this.fileList = [];
              console.log(res.data);
            }).catch((err) => {
              console.log(err);
              this.$message.error('失败', err);
            })
          } else {//编辑栏目
            console.log('编辑栏目');
            service.editcategory(this.ruleForm).then((res) => {
              this.dialogFormVisible = false;
              this.getcategorys();
              this.$message({
                type: "success",
                message: res.data.msg
              });
              this.ruleForm.imgurl = '';
              this.fileList = [];
              console.log(res.data);
            }).catch((err) => {
              console.log(err);
            })
          }

        } else {
          console.log("error submit!!");
          this.$message.error('失败', err);
          return false;
        }
      });
    },
    getcategorys() {
      this.loading = true;
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
        this.loading = false
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
    },
    handChild(data) {
      for (let i = 0; i < data.length; i++) {
        data[i].label = data[i].categoryname
        data[i].value = data[i]._id
      }
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    /* this.page.pagetotal = this.categorys.length */
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.getcategorys();
    service.getonetowcate().then((res) => {
      let datas = res.data.data.category;
      for (let i = 0; i < datas.length; i++) {
        let childdata = datas[i].children;
        this.handChild(childdata);
        datas[i].label = datas[i].categoryname
        datas[i].value = datas[i]._id
      }
      this.allCate = datas;
      console.log(this.allCate);
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