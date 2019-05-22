<template>
  <div class="category">
    <eu-navi></eu-navi>
    <el-row class="handbt">
      <el-button type="success" @click="addEdit('add')">添加用户</el-button>
      <el-button type="danger" @click="deletList(0,true)">批量删除</el-button>
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
        <el-form-item label="用名新密码" prop="password">
          <el-input v-model="user.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="是否管理员" prop="isadmin">
          <el-switch v-model="user.isadmin"></el-switch>
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
import users from './users'
export default users;
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