<template>
    <div>
        <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
        <el-table :data="rightsList" border stripe> 
            <el-table-column type="index">
            </el-table-column>
            <el-table-column label="权限名称" prop="authName"> </el-table-column>
            <el-table-column label="路径" prop="path"> </el-table-column>
            <el-table-column label="权限等级" prop="level">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.level === '0'">一级</el-tag>
                    <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
                    <el-tag type="warning" v-else>三级</el-tag>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 3, 5]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </el-card>
    </div>
</template>

<script>
export default {
  created() {
    this.getRightsList()
  },
  data() {
    return {
      rightsList: [],
      total: 0,
      queryInfo : {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
    }
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list', {
        'params': this.queryInfo,
      })

      if (res.meta.status != 200) {
        return this.$message.error('获取权限列表失败')
      }

      this.rightsList = res.data.permissions
      this.total = res.data.total
      this.$message.success('获取权限列表成功')
    },
    handleSizeChange(size){
      this.queryInfo.pagesize = size
      this.getRightsList()
    },
    handleCurrentChange(page){
      this.queryInfo.pagenum = page
      this.getRightsList()
    },
  }
}
</script>

<style lang="less" scoped>
</style>
