import euNavi from "@/components/navi";
import { quillEditor } from "vue-quill-editor";
import { getDate } from "@/untils/base.js";
import service from '../../service'
import store from '../../store'
import qs from 'qs'

const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction
  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],
  ["link", "image"],
  ["clean"]
];

export default {
  components: {
    euNavi,
    quillEditor
  },
  data() {
    return {
      value: [],
      loading: true,
      content: "",
      serverUrl: "/manager/common/imgUpload", // 这里写你要上传的图片服务器地址
      header: {
        // token: sessionStorage.token
      }, // 有的图片服务器要求请求头需要有token
      editorOption: {
        placeholder: "",
        theme: "snow", // or 'bubble'
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              image: function (value) {
                if (value) {
                  // 触发input框选择图片文件
                  document.querySelector(".avatar-uploader input").click();
                } else {
                  this.quill.format("image", false);
                }
              }
            }
          }
        }
      },
      ruleForm: {
        name: "",
        parentId: "",
        desc: "",
        content: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入文章名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ]
      },
      categorytitle: "添加文章",
      categoryBut: "立即创建",
      currentPage: 1,
      input: "",
      isreset: true,
      page: {
        pagesizes: [12, 20, 50, 100],
        pagesize: 12,
        pagetotal: 100
      },
      formInline: {
        user: "",
        region: ""
      },
      dialogFormVisible: false,
      multipleSelection: [],
      articles: [],
      fileList: [],
      imgurl:{}
    };
  },
  computed: {
    secCate() {
      return store.getters.getSecCategory
    },
    allcate(){
      return store.getters.getAllCate
    }
  },
  watch: {
    $route(to, from) {
      this.findcategory()
    }
  },
  methods: {
    handlecateID(value) {
      this.ruleForm.parentId = value[value.length-1]
      console.log(value);
    },
    handleSuccess(res, file, fileList){
      this.imgurl = res.ret_code;
      this.fileList = fileList;
      console.log(res);
      console.log(file);
      console.log(fileList);
    },
    handleChange(file, fileList) {
      console.log(fileList);
      
     //this.fileList = fileList.slice(-3);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    beforeUpload() {
      // 显示loading动画
    },
    addArticle() {
      console.log(this.ruleForm);
      if (this.isreset) {//添加文章
        if(this.fileList.length == 0){
          this.$message.error('请上传图片');
          return;
        }
        this.ruleForm.imgurl = this.imgurl
        service.addarticle(this.ruleForm).then((res) => {
          console.log(res);
          this.findcategory();
          this.$message({
            type: "success",
            message: res.data.msg
          });
          this.ruleForm.imgurl = '';
          this.fileList = [];
          this.dialogFormVisible = false
        }).catch((err) => {
          this.$message.error('失败', err);
          console.log(err);
        })
      } else {//编辑文章
        if(this.fileList.length == 0){
          this.$message.error('请上传图片');
          return;
        }
        this.ruleForm.imgurl = this.imgurl
        service.editarticle(qs.stringify(this.ruleForm)).then((res) => {
          console.log(res);
          this.findcategory();
          this.$message({
            type: "success",
            message: res.data.msg
          });
          this.ruleForm.imgurl = '';
          this.fileList = [];
          this.dialogFormVisible = false
        }).catch((err) => {
          this.$message.error('失败', err);
          console.log(err);
        })
      }


    },
    uploadSuccess(res, file) {
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      console.log(5555555555555);
      
      console.log(res);
      let quill = this.$refs.myQuillEditor.quill;
      // 如果上传成功
      if (res.code == 200) {
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片  res.url为服务器返回的图片地址
        quill.insertEmbed(length, "image", 'http://127.0.0.1:3000/server/'+res.ret_code);
        // 调整光标到最后
        quill.setSelection(length + 1);
      } else {
        this.$message.error("图片插入失败");
      }
      // loading动画消失
    },
    // 富文本图片上传失败
    uploadError() {
      // loading动画消失
      this.$message.error("图片插入失败");
    },
    onEditorChange({ editor, html, text }) {
      //富文本编辑器  文本改变时 设置字段值
      this.content = html;
      this.ruleForm.content = html;
      console.log(this.content);
    },
    addEdit(handle) {
      this.dialogFormVisible = true;
      this.addEditTitle(handle);
    },
    handleEdit(index, row, handle) {
      this.fileList = [];
      this.addEditTitle(handle);
      this.dialogFormVisible = true;
      if(row.hasOwnProperty('imgurl')&&row.imgurl != ''){
        this.fileList.push({name:'img',url:row.imgurl});
      }
      this.ruleForm = row;
      console.log(index, row);
    },
    addEditTitle(handle) {
      if (handle == "add") {
        this.resetForm();
        this.isreset = true;
        this.categorytitle = "添加文章";
        this.categoryBut = "立即创建";
      } else if (handle == "edit") {
        this.categorytitle = "编辑文章";
        this.categoryBut = "修改编辑";
        this.isreset = false;
      }
    },
    resetForm() {
      this.ruleForm = {
        title: "",
        parentId: "",
        desc: "",
        content: ""
      };
    },
    formatter(row, column) {
      return row.address;
    },
    onSubmit() {
      console.log("submit!");
    },
    handleSizeChange(val) {
      this.page.pagesize = val;
      this.findcategory();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.findcategory();
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
      this.$confirm("此操作将永久删除该栏目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          service.deletearticle(this.multipleSelection).then((res) => {
            this.findcategory();
            this.$message({
              type: "success",
              message: res.data.msg
            });
          }).catch((err) => {
            console.log(err);
            this.$message.error('错误' + err)
          })
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
    findcategory() {
      let _id = this.$route.query.id;
      if (_id) {
        let data = {
          "_id": _id,
          "currentPage": this.currentPage,
          "pageSize": this.page.pagesize
        }
        this.loading = true;
        service.getarticles(data).then((res) => {
          console.log(res.data);
          let datas = res.data.data.articles;
          datas.map((v, k) => {
            datas[k].creatat = getDate(v.creatat, false);
          });
          this.loading = false;
          this.articles = datas;
          this.page.pagetotal = res.data.page.totalPage
          
        }).catch((err) => {
          console.log(err);
          this.$message.error('失败', err);
        })
      }
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    /* this.page.pagetotal = this.articles.length */
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.findcategory()
  },
  beforeCreate() { }, //生命周期 - 创建之前
  beforeMount() { }, //生命周期 - 挂载之前
  beforeUpdate() { }, //生命周期 - 更新之前
  updated() { }, //生命周期 - 更新之后
  beforeDestroy() { }, //生命周期 - 销毁之前
  destroyed() { }, //生命周期 - 销毁完成
  activated() { } //如果页面有keep-alive缓存功能，这个函数会触发
};