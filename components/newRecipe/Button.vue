<template>
  <div class="col-4">
    <button type="button" class="btn btn-success" v-if="buttonType === 'add'" v-on="$listeners">
      <slot></slot>
    </button>
    <button type="button" class="btn btn-danger" v-else v-on="$listeners"><slot></slot></button>
  </div>
</template>

<script>
export default {
  props: {
    buttonType: {
      type: String,
      default: "add",
    },
  },
};
</script>