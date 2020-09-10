<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>设置</el-breadcrumb-item>
            <el-breadcrumb-item>版本列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <!-- 搜索区域 -->
            <el-row :gutter="20">
                <!-- <el-col :span="7">
                  <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                    <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                  </el-input>
                </el-col> -->
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">发布版本</el-button>
                </el-col>
            </el-row>
            <!-- 版本列表区域 -->
            <el-table :data="releaseList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="设备型号" prop="device_type"></el-table-column>
                <el-table-column label="版本名称" prop="version_name"></el-table-column>
                <el-table-column label="版本号" prop="version_code"></el-table-column>
                <el-table-column label="下载地址" prop="download_url"></el-table-column>
                <el-table-column label="描述" prop="description"></el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </el-card>
        <!-- 添加对话框 -->
        <el-dialog title="发布版本" :visible.sync="addDialogVisible" width="50%" @close="addFormClosed">
            <!-- 内容主体区域 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item label="设备型号" prop="device_type">
                    <!-- <el-input v-model="addForm.device_type"></el-input> -->
                    <el-select v-model="addForm.device_type" clearable placeholder="请选择">
                        <el-option v-for="item in deviceTypeOptions" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="版本名称" prop="version_name">
                    <el-input v-model="addForm.version_name"></el-input>
                </el-form-item>
                <el-form-item label="版本号" prop="version_code">
                    <el-input v-model="addForm.version_code"></el-input>
                </el-form-item>
                <el-form-item label="下载地址" prop="download_url">
                    <el-input v-model="addForm.download_url"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input v-model="addForm.description"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRelease">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        created() {
            this.getReleaseList()
        },
        data() {
            const checkUrl = (rule, value, cb) => {
                const regUrl = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/
                if (regUrl.test(value)) {
                    return cb()
                }
                cb(new Error('请输入合法url'))
            }
            return {
                query: '',
                total: 0,
                releaseList: [],
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 5,
                },
                deviceTypeOptions: [
                    { label: 'android', value: 'android' },
                    { label: 'ios', value: 'ios' },
                ],
                addDialogVisible: false,
                addForm: {
                    device_type: '',
                    version_name: '',
                    version_code: '',
                    download_url: '',
                    description: '',
                },
                addFormRules: {
                    device_type: [
                        { required: true, message: '请选择类型', trigger: 'blur' }
                    ],
                    version_name: [
                        { required: true, message: '请输入版本名称', trigger: 'blur' }
                    ],
                    version_code: [
                        { required: true, message: '请输入版本号', trigger: 'blur' }
                    ],
                    download_url: [
                        { required: true, message: '请输入下载地址', trigger: 'blur' },
                        {
                            validator: checkUrl,
                            trigger: 'blur'
                        }
                    ],
                    description: [

                    ],
                },
            }
        },
        methods: {
            async getReleaseList() {
                const { data: res } = await this.$http.get(`releases`, {
                    params: this.queryInfo
                })

                if (res.meta.status != 200) {
                    return this.$message.error('获取列表信息失败')
                }
                this.releaseList = res.data.data
                this.total = res.data.total
            },
            handleSizeChange(size) {
                this.queryInfo.pagesize = size
                this.getReleaseList()
            },
            handleCurrentChange(page) {
                this.queryInfo.pagenum = page
                this.getReleaseList()
            },
            addFormClosed() {
                this.$refs.addFormRef.resetFields()
            },
            addRelease() {
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) return
                    const { data: res } = await this.$http.post(`releases`, this.addForm)

                    if (res.meta.status != 201) {
                        return this.$message.error('创建失败')
                    }

                    this.$message.success('创建成功')
                    this.getReleaseList()
                    this.addDialogVisible = false
                })
            },
        }
    }
</script>

<style lang="less" scoped>

</style>