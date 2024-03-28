<template>
  <div class="row">
    <div class="form-group row mt-3">
      <label for="preFix" class="col-sm-3 col-form-label">{{
        $t("preFix")
      }}</label>
      <div class="col-sm-9">
        <div class="select-wrapper">
          <b-col cols="12" class="footer-col pt-1">
            <div class="loc-col mr-3">
              <b-form-input
                v-model="preFix"
                :disabled="prefixDisable"
              ></b-form-input>
            </div>
          </b-col>
        </div>
      </div>
    </div>
    <div class="form-group row mt-3">
      <label for="inputDefaultLevelID" class="col-sm-3 col-form-label">{{
        $t("selectionofDataSet")
      }}</label>
      <div class="col-sm-9">
        <div class="select-wrapper">
          <b-col cols="12" class="footer-col pt-1">
            <div class="loc-col mr-3">
              <treeselect
                :options="dataSetList"
                :placeholder="$t('search')"
                v-model="selectedDataSet"
                :multiple="true"
              />
            </div>
          </b-col>
        </div>
      </div>
    </div>
    <div class="form-group row mt-4">
      <label for="dataElementList" class="col-sm-3 col-form-label">{{
        $t("selectionofDataElements")
      }}</label>
      <div class="col-sm-9">
        <div class="select-wrapper select-open">
          <treeselect
            :options="dataElementList"
            :placeholder="$t('search')"
            v-model="selectedDEs"
            :load-options="loadOptions"
            :default-expand-level="1"
            :flat="false"
            :multiple="true"
            value-consists-of="LEAF_PRIORITY"
            :show-count="true"
          />
          <!-- <div
            class="d-flex justify-content-end button-selectGroup"
            slot="before-list"
          >
            <b-button
              @click="selectAll()"
              type="button"
              class="btn btn-light btn-common btn-select mx-3"
            >
              {{ $t("selectAll") }}
            </b-button>
            <b-button
              @click="deSelectAll()"
              type="button"
              class="btn btn-light btn-common btn-select"
            >
              {{ $t("deselectAll") }}
            </b-button>
          </div> -->
        </div>
      </div>
      <!-- <div class="col-sm-4">
       
      </div> -->
    </div>
    <div class="row mt-4 pt-2">
      <div class="col-sm-3"></div>
      <div class="col-sm-9 d-flex justify-content-end">
        <b-button
          class="blue-btn"
          :disabled="preFix && selectedDEs.length > 0 ? false : true"
          @click="dataSync()"
          >{{ $t("dataElementSync") }}</b-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import Treeselect from "@riophae/vue-treeselect";
import service from "@/service";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import loadLocChildMixin from "@/helpers/LoadLocationChildMixin";

export default {
  name: "dataEleSync",
  props: [
    "dataSetList",
    "orgLevels",
    "catComboID",
    "dataEleSyncData",
    "appData",
  ],
  components: { Treeselect },
  mixins: [loadLocChildMixin],
  data() {
    return {
      preFix: this.appData.preFix,
      selectedDEs: [],
      selectedDataSet: null,
      dataElementList: [],
      savedDESyncData: this.dataEleSyncData,
      createCall: false,
      deSyncReport: {},
      prefixDisable: "",
    };
  },
  watch: {
    selectedDataSet(newVal) {
      if (newVal) {
        this.dataElementList = [];
        this.getDataElementList();
        this.selectedDEs = [];
      }
    },
    dataEleSyncData: {
      handler(newVal) {
        this.savedDESyncData = newVal;
      },
      deep: true,
    },
  },
  methods: {
    async getDE(dataEleName, sDE, oldDEName) {
      let createJson = {
        aggregationType: "SUM",
        domainType: "AGGREGATE",
        valueType: "INTEGER_ZERO_OR_POSITIVE",
        name: dataEleName,
        shortName: dataEleName,
        categoryCombo: { id: this.catComboID },
        legendSets: [],
        aggregationLevels: [],
      };
      await service
        .createDE(createJson)
        .then((resp) => {
          // console.log(resp, "resp from api");
          if (resp.data.status === "OK" && resp.data.httpStatus === "Created") {
            // console.log(resp.data, resp.data.response["uid"], "inif");
            let actDEID = resp.data.response["uid"];
            // console.log(actDEID, "actDEID", this.savedDESyncData);
            if (actDEID) {
              if (!this.savedDESyncData) {
                this.createCall = true;
                this.savedDESyncData = {};
              }
              this.savedDESyncData[sDE] = {
                TeachingInstance: sDE,
                TeachingDEName: oldDEName,
                LiveInstance: actDEID,
                LiveDEName: dataEleName,
              };
              this.deSyncReport[oldDEName] = this.$i18n.t("success");
            }
            //return actDEID;
          }
        })
        .catch(async (errRes) => {
          await service.getDataElementByName(dataEleName).then((resp) => {
            // console.log(resp, "resp from get api");
            if (resp && resp.data.dataElements.length > 0) {
              let getIdArray = resp.data.dataElements.find(
                (obj) => obj.displayName === dataEleName
              );
              if (getIdArray) {
                if (!this.savedDESyncData) {
                  this.createCall = true;
                  this.savedDESyncData = {};
                }
                // console.log(getIdArray, "getIdArray");
                this.savedDESyncData[sDE] = {
                  TeachingInstance: sDE,
                  TeachingDEName: oldDEName,
                  LiveInstance: getIdArray.id,
                  LiveDEName: getIdArray.displayName,
                };
                this.deSyncReport[oldDEName] = this.$i18n.t("alreadyExists");
              }
            } else {
              this.deSyncReport[oldDEName] =
                this.$i18n.t("error") +
                " - " +
                errRes.response.data.response.errorReports?.[0]?.message;
            }
          });
        });
    },
    async dataSync() {
      this.$store.commit("setLoading", true);
      if (this.selectedDEs.length > 0 && this.preFix != "") {
        let appData = this.appData;
        appData.preFix = this.preFix;
        this.deSyncReport = {};

        let deNameObj = {};
        let oldDEName = {};
        this.selectedDEs.forEach((sDE) => {
          // if (sDE != "all") {
          let isFound = this.dataElementList.map((obj) => {
            return obj.children.find((innerObj) => innerObj.id === sDE);
          });
          //}
          // });

          if (isFound && isFound.length > 0) {
            oldDEName[sDE] = isFound[0]["label"];
            deNameObj[sDE] = this.preFix + " - " + isFound[0]["label"];
          }
          // }
        });
        let allExist = true;
        for (const sDE of this.selectedDEs) {
          // if (sDE != "all") {
          if (
            !this.savedDESyncData ||
            (this.savedDESyncData && !this.savedDESyncData[sDE])
          ) {
            allExist = false;
            // console.log(sDE, "sDE in for loop");
            await this.getDE(deNameObj[sDE], sDE, oldDEName[sDE]);
            // deCreated++;
          } else {
            //deExist++;
            this.deSyncReport[oldDEName[sDE]] = this.$i18n.t("alreadyExists");
          }
          // console.log(this.savedDESyncData, "savedData inside first foreach");
          // });
          // }
        }
        let key = this.generateKey("DESyncData");

        // console.log(
        //   this.savedDESyncData,
        //   "savedData in first",
        //   this.createCall
        // );
        let tableItems = [];

        let html = `<table id="alertTable"  style="
          font-family: arial, sans-serif;
          border-collapse: collapse;
          width: 100%;">
          <tr><th>${this.$i18n.t("DE")}</th><th>${this.$i18n.t(
          "status"
        )}</th></tr>`;
        Object.keys(this.deSyncReport).forEach((i) => {
          let obj = {};
          obj[this.$i18n.t("DE")] = i;
          obj[this.$i18n.t("status")] = this.deSyncReport[i];
          tableItems.push(obj);
          html += `<tr ><td style="
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
">${i}</td><td style="
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
">${this.deSyncReport[i]}</td></tr>`;
        });
        html += "</table>";
        if (!this.createCall && !allExist) {
          this.$store.commit("setLoading", true);
          await service
            .updateConfig({
              data: this.savedDESyncData,
              tableKey: key,
            })
            .then((resp) => {
              if (resp.data.status === "OK") {
                // console.log(
                //   "Data Elements synced successfully",
                //   deExist,
                //   deCreated,
                //   this.selectedDEs.length
                // );

                this.resetForm();
                this.sweetAlert({
                  title: this.$i18n.t("success"),
                  // text: alertText,
                  html: `<div class="customPopup">${html}</div>`,
                });
                this.$emit("saveApp", appData, true);

                this.$store.commit("setLoading", false);
                this.$emit("dataEleSync", this.savedDESyncData);
              }
            });
        }
        //   //craete key in datastore
        if (this.createCall && !allExist) {
          this.$store.commit("setLoading", true);
          service
            .saveConfig({
              data: this.savedDESyncData,
              tableKey: key,
            })
            .then((resp) => {
              if (resp.data.status === "OK") {
                this.createCall = false;
                this.$emit("dataEleSync", this.savedDESyncData);

                console.log("Data Elements synced successfully");
                this.$emit("saveApp", appData, true);

                this.resetForm();
                this.sweetAlert({
                  title: this.$i18n.t("success"),
                  // text: alertText,
                  html: `<div class="customPopup">${html}</div>`,
                });
                this.$store.commit("setLoading", false);
              }
            })
            .catch((err) => {
              this.sweetAlert({
                title: this.$i18n.t("error"),
                text: this.$i18n.t("somethingWentWrong"),
              });
              this.$store.commit("setLoading", false);
            });
        }
        if (allExist) {
          this.$store.commit("setLoading", false);
          this.resetForm();
          this.$emit("saveApp", appData, true);
          this.$emit("dataEleSync", this.savedDESyncData);

          this.sweetAlert({
            title: this.$i18n.t("success"),
            text: this.$i18n.t("deExist"),
          });
        }

        this.prefixDisable = true;
      } else {
        if (this.preFix == "") {
          this.prefixDisable = false;
          this.sweetAlert({
            title: this.$i18n.t("error"),
            text: this.$i18n.t("Kindly give preFix value"),
          });
        } else {
          this.sweetAlert({
            title: this.$i18n.t("error"),
            text: this.$i18n.t("deNotSelected"),
          });
        }
        console.log("Data Elements are not selected");
        this.$store.commit("setLoading", false);
      }
    },
    resetForm() {
      this.preFix = this.appData.preFix;
      this.selectedDEs = [];
      this.selectedDataSet = null;
      this.dataElementList = [];
    },

    // selectAll() {
    //   //console.log("this function getting called", node);
    //   let _t = this;
    //   console.log(_t.selectedDEs.length, _t.dataElementList.length, "length");
    //   if (_t.selectedDEs.includes("all")) {
    //     _t.selectedDEs = [];
    //     _t.dataElementList.forEach((item) => {
    //       //if (item.id != "all") {
    //       if (!_t.selectedDEs.includes(item.id)) _t.selectedDEs.push(item.id);
    //       //}
    //     });
    //   } else if (
    //     !_t.selectedDEs.includes("all") &&
    //     _t.selectedDEs.length === _t.dataElementList.length - 1
    //   ) {
    //     _t.selectedDEs = [];
    //   }
    // },
    // deSelectAll() {
    //   let _t = this;

    //   //if (node.id == "all") {
    //   _t.selectedDEs = [];
    //   // }
    // },
    async getDataElementList() {
      for (let set in this.selectedDataSet) {
        // console.log(this.selectedDataSet[set]);
        let name = this.dataSetList.filter(
          (item) => item.id == this.selectedDataSet[set]
        );
        this.$store.commit("setLoading", true);
        await service
          .getDataElementsByDataSets(this.selectedDataSet[set], true)
          .then((resp) => {
            let arr = [];
            arr.push({
              id: name[0].id,
              label: name[0].label,
              children: resp.data.dataElements.map((obj) => {
                return {
                  id: obj.id,
                  label: obj.displayName,
                };
              }),
            });
            this.dataElementList.push(arr[0]);
            // console.log("this.dataElementList", this.dataElementList);
            this.$store.commit("setLoading", false);
          })
          .catch((err) => {
            this.$store.commit("setLoading", false);
            console.log(err, "errr");
          });
      }
      // await service
      //   .getDataElementsByDataSets(this.selectedDataSet, true)
      //   .then((resp) => {
      //     if (resp && resp.data) {
      //       let arr = [];

      //       arr = resp.data.dataElements.map((obj) => {
      //         return { id: obj.id, label: obj.displayName };
      //       });
      //       var options = [
      //         {
      //           id: "all",
      //           label: "Select All",
      //         },
      //       ];
      //       this.dataElementList = options.concat(arr);
      //       console.log("this.dataElementList", this.dataElementList);
      //     }
      //   })
      //   .catch((err) => {
      //     console.log(err, "errr");
      //   });
    },
  },
  mounted() {
    if (this?.appData?.preFix) {
      this.prefixDisable = true;
    } else {
      this.prefixDisable = false;
    }
  },
};
</script>
<style scoped>
#alertTable {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

#alertTable td,
#alertTable th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}
</style>
