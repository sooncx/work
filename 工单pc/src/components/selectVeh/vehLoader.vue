<template>
	<content-loader
		:height="220"
		:width="300"
		:speed="8"
		primaryColor="#eaeaea"
		secondaryColor="#f1f7fe"
	>
		<circle cx="13" cy="25" r="8" /> 
		<rect x="25" y="19" rx="5" ry="5" width="202" height="10" /> 
		<rect x="25" y="46" rx="5" ry="5" width="200" height="10" /> 
		<circle cx="13" cy="78" r="8" /> 
		<rect x="26" y="72" rx="5" ry="5" width="220" height="10" /> 
		<circle cx="13" cy="103" r="8" /> 
		<rect x="27.86" y="96" rx="5" ry="5" width="120" height="10" /> 
		<rect x="0" y="0" rx="0" ry="0" width="0" height="0" /> 
		<circle cx="13" cy="53" r="8" /> 
		<rect x="26.86" y="126" rx="5" ry="5" width="180" height="10" /> 
		<rect x="26.86" y="153" rx="5" ry="5" width="160" height="10" /> 
		<rect x="26.86" y="180" rx="5" ry="5" width="210" height="10" /> 
		<rect x="25.86" y="203" rx="5" ry="5" width="200" height="10" /> 
		<circle cx="13" cy="131" r="8" /> 
		<circle cx="13" cy="158" r="8" /> 
		<circle cx="13" cy="185" r="8" /> 
		<circle cx="13" cy="207" r="8" />
	</content-loader>
</template>
<script>
  import { ContentLoader } from "vue-content-loader"

  export default {
    components: {
      ContentLoader
    }
  }
</script>