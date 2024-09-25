<template>
    <div class="app-container">
      <customer-form></customer-form>
    </div>
</template>
<script>
import customerForm from '@/components/customerForm'
export default {
    name: 'Custom',
    components: { customerForm },
    data(){
        return {
        }
    }
}
</script>
<style lang="scss" scoped>
.app-container {
  height: calc(100vh - 50px - 34px);
}
</style>