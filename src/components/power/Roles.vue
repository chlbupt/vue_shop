<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加角色 -->
            <el-row>
                <el-col>
                    <el-button type="primary">
                        添加角色
                    </el-button>
                </el-col>
            </el-row>
            <!-- 角色列表区域 -->
            <el-table :data="roleList" border stripe>
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row v-for="(item1, i1) in scope.row.children" :key="item1.id"
                            :class="['bdbottom', i1 == 0 ? 'bdtop' : '', 'vcenter']">
                            <!-- 一级权限 -->
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 二级和三级权限 -->
                            <el-col :span="19">
                                <!-- 二级权限 -->
                                <el-row v-for="(item2, i2) in item1.children" :key="item2.id"
                                    :class="[i2 == 0 ? '' : 'bdtop', 'vcenter']">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">
                                            {{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <!-- 三级权限 -->
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="(item3, i3) in item2.children" :key="item3.id"
                                            closable @close="removeRightById(scope.row,item3.id)">
                                            {{item3.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                        <el-button type="warning" size="mini" icon="el-icon-setting" @click="showRightDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 分配权限 -->
        <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" >
            <!-- 树形控件 -->
            <el-tree :data="rightList" :props="treeProps" node-key="id" show-checkbox default-expand-all :default-checked-keys="defkeys"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="setRightDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  created() {
    this.getRoleList()
  },
  data() {
    return {
      roleList: [],
      setRightDialogVisible: false,
      rightList: [],
      treeProps:{
          children:'children',
          label:'authName',
      },
      defkeys:[]
    }
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get('roles')

      if (res.meta.status != 200) {
        return this.$message.error('获取角色列表失败')
      }

      this.roleList = res.data
    },
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult != 'confirm') {
        return this.$message.info('取消了删除')
      }

      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )

      if (res.meta.status != 200) {
        return this.$message.success('删除权限成功')
      }

      // this.getRoleList()
      role.children = res.data
    },
    async showRightDialog(role) {
      const { data: res } = await this.$http.get('rights/tree')

      if (res.meta.status != 200) {
        return this.message.error('获取权限列表失败')
      }
      this.rightList = res.data
      this.getLeafNode(role, this.defkeys)

      this.setRightDialogVisible = true
    },
    getLeafNode(node, arr){
        if(!node.children){
            return arr.push(node.id)
        }

        node.children.forEach(item => {
            this.getLeafNode(item, arr)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>