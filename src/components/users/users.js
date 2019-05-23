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
            addoredit: true,
            page: {
                pagesizes: [12, 35, 50, 100],
                pagesize: 12,
                pagetotal: 100
            },
            formInline: {
                user: "",
                region: ""
            },
            dialogFormVisible: false,
            user: {
                username: "",
                password: "",
                isadmin: false
            },
            rules: {
                username: [
                    { required: true, message: "请输入用户名", trigger: "blur" },
                    { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
                ],
                password: [
                    { required: true, message: "请输入密码", trigger: "blur" },
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
            row.password = '';
            this.user = row;
            console.log(index, row);
        },
        addEditTitle(handle) {
            if (handle == "add") {
                this.addoredit = true;
                this.resetForm();
                this.isreset = true;
                this.categorytitle = "添加用户";
                this.categoryBut = "立即创建";
            } else if (handle == "edit") {
                this.addoredit = false;
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
            let users = this.multipleSelection;
            let checkAdmin = false
            users.forEach((v, k) => {
                if (v.username == 'admin') {
                    this.$message.error('不允许删除管理员账号');
                    checkAdmin = true;
                    return;
                }
            });
            if (checkAdmin) {
                return;
            }
            this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    let user = this.multipleSelection;

                    this.deleusers(index, user)

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
        deleusers(index, user) {

            service
                .deleteuser(user)
                .then(res => {
                    console.log(res);
                    let userlist = this.userlist
                    for (let i = 0; i < user.length; i++) {
                        let _id = user[i]._id
                        for (let j = 0; j < userlist.length; j++) {
                            if (_id == userlist[j]._id) {
                                this.userlist.splice(j, 1)
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
                    this.$message.error('失败',err);
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
                    if (!this.user.isadmin) {
                        this.user.isadmin = false
                    }
                    let user = {
                        username: this.user.username,
                        password: this.user.password,
                        isadmin: this.user.isadmin
                    }
                    if (this.addoredit) {//添加用户
                        service.adduser(user).then((res) => {
                            if (res.data.code == 200) {
                                this.$message({
                                    type: "success",
                                    message: "用户添加成功"
                                });
                                this.dialogFormVisible = false
                                this.getusers();
                            } else {
                                this.$message.error('添加用户失败');
                            }
                        }).catch((err) => {
                            console.log(err);
                            this.$message.error('失败',err);
                        })
                    } else {//编辑用户
                        this.user.username = user.username;
                        this.user.password = user.password;
                        this.user.isadmin = user.isadmin
                        console.log(this.user);

                        service.edituser(qs.stringify(this.user)).then((res) => {
                            if (res.data.code == 200) {
                                this.$message({
                                    type: "success",
                                    message: "用户编辑成功"
                                });
                                this.dialogFormVisible = false
                                this.getusers();
                            } else {
                                this.$message.error('添加编辑失败');
                            }
                        }).catch((err) => {
                            console.log(err);
                            this.$message.error('失败',err);
                        })
                    }

                } else {
                    console.log("error submit!!");
                    this.$message.error('失败',err);
                    return false;
                }
            });
        },
        getusers() {
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
                    this.$message.error('失败',err);
                    console.log(err);
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
        this.getusers()
    },
    beforeCreate() { }, //生命周期 - 创建之前
    beforeMount() { }, //生命周期 - 挂载之前
    beforeUpdate() { }, //生命周期 - 更新之前
    updated() { }, //生命周期 - 更新之后
    beforeDestroy() { }, //生命周期 - 销毁之前
    destroyed() { }, //生命周期 - 销毁完成
    activated() { } //如果页面有keep-alive缓存功能，这个函数会触发
};