<script setup lang="ts">
import { initRouter } from "@/router/utils";
import { storageLocal } from "@pureadmin/utils";
import { type CSSProperties, ref, computed } from "vue";
import { useUserStoreHook } from "@/store/modules/user";
import { usePermissionStoreHook } from "@/store/modules/permission";

defineOptions({
  name: "PermissionPage"
});

const elStyle = computed((): CSSProperties => {
  return {
    width: "85vw",
    justifyContent: "start"
  };
});

const username = ref(useUserStoreHook()?.username);

const options = [
  {
    value: "admin",
    label: "管理员角色"
  },
  {
    value: "common",
    label: "普通角色"
  }
];

function onChange() {
  useUserStoreHook()
    .loginByUsername({ username: username.value, password: "admin123" })
    .then(res => {
      if (res.err) {
        storageLocal().removeItem("async-routes");
        usePermissionStoreHook().clearAllCachePage();
        initRouter();
      }
    });
}
</script>

<template>
  <div>
    <p class="mb-2">
      Mô phỏng backend trả về các tuyến đường tương ứng dựa trên vai trò khác
      nhau, quan sát sự thay đổi của menu bên trái (vai trò quản trị viên có thể
      xem menu quản lý hệ thống, vai trò thông thường không thể xem menu quản lý
      hệ thống)
    </p>
    <el-card shadow="never" :style="elStyle">
      <template #header>
        <div class="card-header">
          <span>当前角色：{{ username }}</span>
        </div>
        <el-link
          class="mt-2"
          href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/permission/page/index.vue"
          target="_blank"
        >
          代码位置 src/views/permission/page/index.vue
        </el-link>
      </template>
      <el-select v-model="username" class="!w-[160px]" @change="onChange">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-card>
  </div>
</template>
