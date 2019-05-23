<template>
  <div class="category">
    <eu-navi></eu-navi>
    <el-row class="handbt">
      <el-button type="success" @click="addEdit('add')">添加栏目</el-button>
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
      :data="nowCategorysData"
      style="width: 100%"
      ref="multipleTable"
      :default-sort="{prop: 'creatat', order: 'descending'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="creatat" label="日期" sortable width="180"></el-table-column>
      <el-table-column prop="categoryname" label="栏目名称" sortable width="180"></el-table-column>
      <!-- <el-table-column prop="parents.categoryname" label="父级分类"></el-table-column> -->
      <el-table-column prop="desc" label="栏目描述"></el-table-column>
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
        <el-form-item label="栏目名称" prop="categoryname">
          <el-input v-model="ruleForm.categoryname"></el-input>
        </el-form-item>
        <el-form-item label="是否一级" prop="isparent">
          <el-switch v-model="ruleForm.isparent"></el-switch>
        </el-form-item>
        <el-form-item label="父级栏目" prop="parentId" v-if="!ruleForm.isparent">
          <el-select v-if="allCate" v-model="ruleForm.parentId" placeholder="请选择父级">
            <el-option :label="item.categoryname" :value="item._id" v-for="(item,index) in allCate" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="栏目描述" prop="desc">
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
import category from "./category";
export default category;
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