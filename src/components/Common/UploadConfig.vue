<template>
  <b-modal
    v-model="updConfig"
    hide-footer
    centered
    size="md"
    :title="$t('uploadConfigFiles')"
    no-close-on-backdrop
  >
    <div class="">
      <div
        class="form-group row d-flex justify-content-center align-items-center"
      >
        <label
          for="inputDashboardDescription"
          class="col-sm-4 col-form-label"
          >{{ $t("selectFiles") }}</label
        >
        <div class="col-sm-8 p-t-4px">
          <input
            type="file"
            multiple
            class="form-control-file"
            style="font-size: 0.9375rem"
            name="configFile"
            ref="configFile"
            @change="onFileChange"
            id="ConfigFile"
            accept="application/ZIP"
          />
        </div>
      </div>
      <div class="row mt-3 float-right">
        <div class="col-sm-12 text-right">
          <button
            type="button"
            class="btn btn-primary btn-sm new-btn1 blue-btn"
            v-on:click="uploadFile"
          >
            {{ $t("upload") }}
          </button>
        </div>
      </div>
    </div>
  </b-modal>
</template>
<script>
import service from "@/service";
import JSZip from "jszip";
export default {
  props: ["uploadConfig"],
  data() {
    return { selectedFiles: {}, updConfig: false };
  },
  watch: {
    uploadConfig(newValue) {
      this.updConfig = newValue;
    },
    updConfig(newValue) {
      if (!newValue) {
        this.$emit("hideModal");
      }
    },
  },
  methods: {
    onFileChange(event) {
      this.selectedFiles = {};
      this.$store.commit("setLoading", true);
      // console.log(
      //   this.$refs.configFile,
      //   this.$refs.configFile.files,
      //   "files",
      //   typeof this.$refs.configFile.files,
      //   Object.keys(this.$refs.configFile.files)
      // );
      Object.keys(this.$refs.configFile.files).forEach((fileIndex) => {
        let file = this.$refs.configFile.files[fileIndex];
        var new_zip = new JSZip();
        new_zip.loadAsync(file).then(async (zip) => {
          let isDir = Object.keys(zip.files).find((f) => zip.files[f].dir);
          for (const f in zip.files) {
            if (!zip.files[f].dir) {
              let fileData = await zip.files[f].async("string");
              let fData = JSON.parse(fileData);
              this.removeCID(fData);
              let fName = isDir ? f.split("/")[1] : f;
              fName = fName.split(".")[0];
              this.selectedFiles[fName] = fData;
            }
            if (
              Object.keys(zip.files).length ===
              Object.keys(this.selectedFiles).length
            ) {
              this.$store.commit("setLoading", false);
            }
          }

          // console.log(this.selectedFiles, "this.selectedFiles");
        });
      });
    },
    removeCID(obj) {
      if (obj && Object.prototype.hasOwnProperty.call(obj, "defaultLevelID"))
        obj["defaultLevelID"] = "";
      if (obj && Object.prototype.hasOwnProperty.call(obj, "preFix"))
        obj["preFix"] = "";
      if (obj && Object.prototype.hasOwnProperty.call(obj, "subLevelID"))
        obj["subLevelID"] = "";
      if (obj && Object.prototype.hasOwnProperty.call(obj, "defaultLocationID"))
        obj["defaultLocationID"] = [];
      if (obj && Object.prototype.hasOwnProperty.call(obj, "cid"))
        obj["cid"] = "";
      if (obj && Object.prototype.hasOwnProperty.call(obj, "name"))
        obj["name"] = Array.isArray(obj["name"])
          ? obj["name"][0] || ""
          : obj["name"];
      if (obj && Object.prototype.hasOwnProperty.call(obj, "static_name"))
        obj["static_name"] = Array.isArray(obj["static_name"])
          ? obj["static_name"][0] || ""
          : obj["static_name"];
      if (obj instanceof Array) obj.forEach(this.removeCID);
      else if (obj instanceof Object) for (var k in obj) this.removeCID(obj[k]);
    },
    uploadFile() {
      this.$store.commit("setLoading", true);
      service
        .getAllKeys({})
        .then((res) => {
          this.processUploadFile(res);
        })
        .catch(() => {
          this.processUploadFile();
        });
    },
    async processUploadFile(res = null) {
      let fileSuccess = [],
        fileDuplicate = [],
        fileError = [],
        promises = [],
        files = [];
      Object.keys(this.selectedFiles).forEach((key) => {
        if (res && res.data.includes(key)) {
          fileDuplicate.push(key);
        } else {
          files.push(key);
          promises.push(
            service.saveConfig({ data: this.selectedFiles[key], tableKey: key })
          );
        }
      });
      await Promise.allSettled(promises).then((results) => {
        results.forEach((response, i) => {
          if (response.status === "fulfilled") {
            fileSuccess.push(files[i]);
          } else {
            fileError.push(files[i]);
          }
        });
      });
      this.$store.commit("setLoading", false);
      let successText = this.createStatusText(
        fileSuccess,
        "success",
        "success"
      );
      let duplicateText = this.createStatusText(
        fileDuplicate,
        "ignored",
        "info"
      );
      let errorText = this.createStatusText(fileError, "error", "danger");
      this.$swal({
        title: this.$i18n.t("status"),
        html: `<div>${successText} ${duplicateText} ${errorText}</div>`,
        showCancelButton: false,
        reverseButtons: true,
        confirmButtonText: this.$i18n.t("ok"),
        //cancelButtonText: this.$i18n.t("ok"),
      }).then((result) => {
        this.$emit("uploadSuccess");
        // if (result.value) {
        //   this.$router.push("/");
        // } else {
        this.$router.go();
        //}
      });
      this.resetFileDetails();
    },
    createStatusText(files, textType, textClass) {
      let text = "";
      if (files.length) {
        let textLI = "";
        files.forEach((f) => {
          textLI += `<li class="text-left">${f}</li>`;
        });
        text = `<div>
          <div class="text-left">
            <strong class="text-${textClass}">${this.$i18n.t(
          `${textType}Head`
        )}</strong> ${this.$i18n.t(`${textType}Text`, {
          fileLength: files.length,
        })}
          </div>
          <ul>
            ${textLI}
          </ul>
        </div>`;
      }
      return text;
    },
    resetFileDetails() {
      this.selectedFiles = {};
      this.$refs.configFile.value = null;
    },
  },
};
</script>
