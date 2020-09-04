<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" width="80px">
          <template slot-scope="scope">
            <el-switch @change="userStateChanged(scope.row)" v-model="scope.row.mg_state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delUser(scope.row.id)"></el-button>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="allotRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 3, 5]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </el-card>

    <!-- 添加对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="addFormClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="allotRightDialogVisible" width="50%" @close="allotRightDialogClosed" >
      <!-- 内容主题区 -->
      <div>
        <p>当前用户:{{userinfo.username}}</p>
        <p>当前角色:{{userinfo.role_name}}</p>
        <p>分配新角色:
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="allotRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {USERS} from '@/util/api.js'
  export default {
    created() {
      this.getUserList()
    },
    data() {
      const checkEmail = (rule, value, cb) => {
        const regEmail = /^\w+@\w+(\.\w+)+$/
        if (regEmail.test(value)) {
          return cb()
        }
        cb(new Error('请输入合法邮箱'))
      }
      const checkMobile = (rule, value, cb) => {
        const regMobile = /^1[34578]\d{9}$/
        if (regMobile.test(value)) {
          return cb()
        }
        // 返回一个错误提示
        cb(new Error('请输入合法的手机号码'))
      }
      return {
        query: '',
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 5
        },
        userList: [],
        total: 0,
        dialogVisible: false,
        editDialogVisible: false,
        addForm: {
          username: '',
          password: '',
          mobile: '',
          email: ''
        },
        addFormRules: {
          username: [
            {
              required: true,
              message: '请输入用户名',
              trigger: 'blur'
            },
            {
              max: 10,
              min: 3,
              message: '用户名的长度在3~10个字符之间',
              trigger: 'blur'
            }
          ],
          password: [
            {
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
            {
              max: 15,
              min: 6,
              message: '密码的长度在6~15个字符之间',
              trigger: 'blur'
            }
          ],
          email: [
            {
              required: true,
              message: '请输入邮箱',
              trigger: 'blur'
            },
            {
              validator: checkEmail,
              trigger: 'blur'
            }
          ],
          mobile: [
            {
              required: true,
              message: '请输入手机',
              trigger: 'blur'
            },
            {
              validator: checkMobile,
              trigger: 'blur'
            }
          ]
        },
        editForm: {
          email: '',
          mobile: ''
        },
        editFormRules: {
          email: [
            {
              required: true,
              message: '请输入邮箱',
              trigger: 'blur'
            },
            {
              validator: checkEmail,
              trigger: 'blur'
            }
          ],
          mobile: [
            {
              required: true,
              message: '请输入手机',
              trigger: 'blur'
            },
            {
              validator: checkMobile,
              trigger: 'blur'
            }
          ]
        },
        allotRightDialogVisible: false,
        userinfo: {},
        rolesList: [],
        selectedRoleId:'',
      }
    },
    methods: {
      async getUserList() {
        const { data: res } = await this.$http.get(USERS, {
          params: this.queryInfo
        })
        if (res.meta.status != 200) {
          return this.$message.error(res.meta.msg)
        }

        this.userList = res.data.users
        this.total = res.data.total
      },
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getUserList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getUserList()
      },
      async userStateChanged(userInfo) {
        const state = userInfo.mg_state === true ? 1 : 0;
        const { data: res } = await this.$http.put(
          `/${USERS}/${userInfo.id}/state/${state}`
        )

        if (res.meta.status != 200) {
          userInfo.mg_state = !userInfo.mg_state
          return this.$message.error('更新用户状态失败')
        }

        return this.$message.success('更新用户状态成功')
      },
      addDialogClosed() {
        this.$refs.addFormRef.resetFields()
      },
      addUser() {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return
          const { data: res } = await this.$http.post('users', this.addForm)

          if (res.meta.status != 201) {
            return this.$message.error('添加用户失败')
          }

          this.$message.success('添加用户成功')

          this.dialogVisible = false

          this.getUserList()
        })
      },
      async showEditDialog(userId) {
        const { data: res } = await this.$http.get('users/' + userId)

        if (res.meta.status != 200) {
          return this.$message.error('查询用户信息失败')
        }

        this.editForm = res.data
        this.editDialogVisible = true
      },
      editDialogClosed() {
        this.$refs.editFormRef.resetFields()
      },
      editUser() {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return;
          const { data: res } = await this.$http.put('users/' + this.editForm.id, {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          })

          if (res.meta.status != 200) {
            return this.$message.error('更新信息失败')
          }

          this.$message.success('更新信息成功')

          this.editDialogVisible = false

          this.getUserList()
        })
      },
      async delUser(userId) {
        const confirmResult = await this.$confirm('此操作将永久删除用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);

        if (confirmResult != 'confirm') {
          return this.$message.info('取消删除')
        }

        const { data: res } = await this.$http.delete('users/' + userId)

        if (res.meta.status != 200) {
          return this.$message.error('删除用户失败')
        }

        this.$message.success('删除用户成功')

        this.getUserList()
      },
      addFormClosed() {
        this.$refs.addFormRef.resetFields()
      },
      async allotRole(userinfo){
        this.userinfo = userinfo
        const {data: res} = await this.$http.get('roles')

        if(res.meta.status != 200){
          return this.$message.error('获取权限列表失败')
        }
        this.rolesList = res.data
        this.allotRightDialogVisible = true
      },
      async saveRoleInfo(){
        if(!this.selectedRoleId){
          return this.$message.error('选择要分配的角色')
        }

        const {data: res} = await this.$http.put(`users/${this.userinfo.id}/role`, {
          rid: this.selectedRoleId
        })

        if(res.meta.status != 200){
          return this.$message.error('分配角色失败')
        }

        this.$message.success('分配角色成功')
        this.getUserList()

        this.allotRightDialogVisible = false
      },
      allotRightDialogClosed(){
        this.selectedRoleId = ''
        this.userinfo = {}
      }
    }
  }
</script>

<style>
</style>