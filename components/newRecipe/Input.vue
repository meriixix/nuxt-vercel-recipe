<template>
  <div :class="colStyle">
    <slot></slot>
    <input
      type="text"
      class="form-control"
      :placeholder="placeholder"
      @input="$emit('input', $event.target.value)"
      :value="value"
    />

  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: "",
    },
    colStyle: {
      type: String,
      default: "col-12",
    },
    value: {
      type: String,
      default: "",
    },
  },
};
</script>