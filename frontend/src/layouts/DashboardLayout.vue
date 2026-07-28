<script setup lang="ts">
import { ref } from 'vue'
import { NLayout, NLayoutSider, NLayoutContent } from 'naive-ui'
import DashboardHeader from '@/components/DashboardHeader.vue'
import DashboardSidebar from '@/components/DashboardSidebar.vue'

const colapsado = ref(false)
</script>

<template>
	<n-layout has-sider style="height: 100svh">
		<n-layout-sider
			bordered
			collapse-mode="width"
			:collapsed-width="0"
			:width="240"
			:collapsed="colapsado"
			:native-scrollbar="false"
			trigger-style="display: none"
		>
			<DashboardSidebar />
		</n-layout-sider>

		<n-layout>
			<DashboardHeader @toggle-sidebar="colapsado = !colapsado" />

			<n-layout-content content-style="padding: var(--space-page-y) var(--space-page-x)">
				<router-view />
			</n-layout-content>
		</n-layout>
	</n-layout>
</template>
