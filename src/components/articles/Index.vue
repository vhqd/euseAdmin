<template>
  <div class="category">
    <eu-navi></eu-navi>
    <el-row class="handbt">
      <el-button type="success" @click="addEdit('add')">添加文章</el-button>
      <el-button type="danger" @click="deletList(true)">批量删除</el-button>
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

    <el-dialog :title="categorytitle" :visible.sync="dialogFormVisible" width="75%">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="文章名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="选择栏目" prop="parent">
          <el-cascader :options="options" change-on-select></el-cascader>
        </el-form-item>
        <el-form-item label="文章内容："></el-form-item>
        <el-upload
          class="avatar-uploader"
          :action="serverUrl"
          name="img"
          :headers="header"
          :show-file-list="false"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :before-upload="beforeUpload"
        ></el-upload>
        <quill-editor
          ref="myQuillEditor"
          :content="content"
          :options="editorOption"
          @change="onEditorChange($event)"
          style="width:93%;margin-left:7%;"
        ></quill-editor>
        <el-form-item></el-form-item>
        <el-form-item>
          <el-button type="primary">新建文章</el-button>
          <el-button>重置</el-button>
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
import article from "./articles";
export default article;
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