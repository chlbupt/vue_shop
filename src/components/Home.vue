<template>
    
    <el-container class='home-container'>
        <el-header>
        <div>
          <img src="../assets/logo.png" alt="">
          <span>电商后台管理系统</span>
        </div>
          <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <el-container>
          <el-aside :width="isCollapse ? '64px' : '200px'">
            <div class="toggle-button" @click="toggleCollapse">
              |||
            </div>
            <el-menu background-color="#333744" text-color="#fff" active-text-color="#409bff" unique-opened :collapse-transition="false" :collapse="isCollapse"	router :default-active="activePath">
            <!--一级菜单 -->
              <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
                <!-- 一级菜单模板区 -->
                <template slot="title">
                  <i :class="icons[item.id]"></i>
                  <span>{{item.authName}}</span>
                </template>
                <!-- 二级菜单 -->
                <el-menu-item :index="`/${subMenu.path}`" v-for="subMenu in item.children" :key="subMenu.id" @click="saveNavStatus(`/${subMenu.path}`)">
                  <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>{{subMenu.authName}}</span>
                  </template>
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </el-aside>
          <el-main>
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist: [],
      icons: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: '',
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('./login')
    },
    // 获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menulist = res.data
    },
    // 折叠菜单
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存菜单激活状态
    saveNavStatus(navPath) {
      window.sessionStorage.setItem('activePath', navPath)
      this.activePath = navPath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0px;
  align-items: center;
  color: #fff;
  font-size: 20px;

  > div {
    display: flex;
    align-items: center;
    > span {
      margin-left: 15px;
    }
    > img {
      height: 30px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
