<template>
  <div class="row mt-2">
    <div class="col-lg-12">
    <h6><span class="text-capitalize" v-if="formType != 'new'">{{$t("templateName")}} - </span>{{ selectedName }}</h6>
      <div class="form-group row">
        <div class="col-lg-6">
          <div class="form-group row">
            <label for="orgLevels" class="col-sm-6 col-form-label">{{
              $t("selectionOfLevel")
            }}</label>
            <div class="col-sm-6">
              <div class="select-wrapper">
                <b-form-select
                  id="orgLevels"
                  class="form-control"
                  v-model="selectedOrgLevel"
                  :options="orgLevels"
                  :disabled="selectedOrgLevel ? true : false"
                ></b-form-select>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group row">
            <label for="dataElementList" class="col-sm-4 col-form-label">{{
              $t("period")
            }}</label>
            <div class="col-sm-8">
              <div class="select-wrapper">
                <Datepicker
                  v-model="customPeriod"
                  type="date"
                  range="true"
                  class="form-control ml-2 p-0"
                  format="YYYY-MM-DD"
                ></Datepicker>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="form-group row mt-3">
        <label for="inputDefaultLevelID" class="col-sm-3 col-form-label">{{
          $t("selectionOfOrganization")
        }}</label>
        <div class="col-sm-9">
          <div class="select-wrapper">
            <b-col cols="12" class="footer-col pt-1">
              <div class="loc-col mr-3 small">
                <treeselect
                  name="orgList"
                  :options="orgOptionsUpdated"
                  :flat="true"
                  :multiple="true"
                  :load-options="loadOptions"
                  :placeholder="$t('search')"
                  v-model="selectedOrg"
                  :default-expand-level="1"
                />
              </div>
            </b-col>
          </div>
        </div>
      </div>
      <div class="form-group row mt-3">
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
      </div>

      <div class="row mt-4 pt-2">
        <div class="col-sm-3"></div>
        <div class="col-sm-9 d-flex justify-content-end align-items-end">
          <b-button class="blue-btn" @click="continueM()">{{
            $t("save")
          }}</b-button>
        </div>
      </div>
      <!-- <p class="mt-4 pt-2">
        {{ $t("note1") }}
      </p> -->
    </div>
  </div>
</template>
<script>
import Treeselect from "@riophae/vue-treeselect";
import service from "@/service";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import loadLocChildMixin from "@/helpers/LoadLocationChildMixin";
import Datepicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import { randomString } from "@/components/Common/commonFunctions";
import chunk from "lodash/chunk";

export default {
  name: "expImpData",
  props: [
    "orgLevels",
    "dataSetList",
    "dataEleSync",
    "appData",
    "updateExpImp",
    "connectionStatus",
    "emitObj",
  ],
  components: { Treeselect, Datepicker },
  mixins: [loadLocChildMixin],

  data() {
    return {
      appDataLocal: this.appData,
      selectedName: "",
      selectedDEs: [],
      selectedOrg: [],
      formType: "new",
      dataElementList: [],
      orgOptions: [],
      orgOptionsUpdated: [],
      customPeriod: [],
      templateName: "",
      finalIncJson: {
        dataValues: [],
      },
      savedTemplates: null,
      tempId: null,
      // tempItems: [],
      templatesData: null,
      // currentPage: 1,
      // perPage: 10,
      // rows: 0,
      executeableObj: null,
      uploadChunkLogs: null,
      statusLogs: null,
    };
  },
  watch: {
    // uploadChunkLogs: {
    //   handler(newVal) {
    //     this.$store.commit(
    //       "setLoadingText",
    //       JSON.parse(JSON.stringify(newVal))
    //     );
    //   },
    //   deep: true,
    // },
    emitObj: {
      handler(newVal) {
        this.executeableObj = newVal;
      },
      deep: true,
    },
    executeableObj: {
      handler(newVal) {
        console.log("emiitede from header", newVal);
        this.executeTemplates(newVal.item,  newVal.type);
      },
      deep: true,
    },
    // templatesData: {
    //   handler(newVal) {
    //     this.rows = Object.keys(newVal).length;
    //     this.tempFields = [
    //       //{ key: "id", label: this.$i18n.t("id") },
    //       { key: "name", label: this.$i18n.t("name") },
    //       { key: "createdOn", label: this.$i18n.t("createdOn") },
    //       {
    //         key: "edit",
    //         label: this.$i18n.t("edit"),
    //       },
    //       {
    //         key: "view",
    //         label: this.$i18n.t("view"),
    //       },
    //       {
    //         key: "execute",
    //         label: this.$i18n.t("execute"),
    //       },
    //     ];
    //     this.tempItems = [];
    //     Object.keys(newVal).forEach((keys) => {
    //       let rows = {};
    //       //rows["id"] = keys;
    //       rows["name"] = newVal[keys]["tempName"];
    //       rows["createdOn"] = newVal[keys]["createdOn"];
    //       rows["tempDetails"] = newVal[keys]["tempDetails"];
    //       this.tempItems.push(rows);
    //     });
    //   },
    //   deep: true,
    // },
    updateExpImp(newVal) {
      //this.updatePage = newVal;
      this.getLocationList();
      this.getDataElementList();
    },

    connectionStatus(newVal) {
      //this.updatePage = newVal;
      this.getLocationList();
      this.getDataElementList();
    },

    appData: {
      handler(newVal) {
        this.appDataLocal = newVal;
      },
      deep: true,
    },
    selectedDataSet(newVal) {
      if (newVal) {
        this.dataElementList = [];
        this.getDataElementList();
        // this.getDataSetPeriod();
        //this.getDataSetPeriod();
        this.deSelectAll();
      }
    },
    orgOptions: {
      handler(newValue) {
        // console.log(newValue, this.selectedOrgLevel, "orgOptions watch");

        if (this.selectedOrgLevel && newValue && newValue.length) {
          // eslint-disable-next-line
          this.orgOptionsUpdated = this.newLocList(
            JSON.parse(JSON.stringify(newValue)),
            this.selectedOrgLevel
          );
        } else {
          this.orgOptionsUpdated = [];
        }
      },
      deep: true,
    },
    selectedOrgLevel(newVal) {
      // console.log(newValue, this.orgOptions.length, "selectedOrgLevel watch");

      if (newVal && this.orgOptions.length) {
        // eslint-disable-next-line
        this.orgOptionsUpdated = this.newLocList(
          JSON.parse(JSON.stringify(this.orgOptions)),
          newVal
        );
      } else {
        this.orgOptionsUpdated = [];
      }
    },
  },
  computed: {
    selectedDataSet() {
      let arr = [];
      if (this.$store.getters.getDataSetList !== null) {
        arr = this.$store.getters.getDataSetList.map((obj) => obj.id);
      }
      return arr;
    },
    selectedOrgLevel() {
      // console.log("calling selectedOrgLevel", this.orgLevels);

      let level = this.appDataLocal?.defaultZoneLevel || null;
      //   if (this.orgLevels.length > 0) {
      if (!level) {
        let zone = this.orgLevels.find((o) =>
          o.text.toLowerCase().includes("zone")
        );

        if (zone) {
          level = zone.value;
        } else {
          let zoneLevels = this.orgLevels?.map((o) => o.value * 1);

          level = Math.max(...zoneLevels);
        }
      }

      return level;
    },
  },
  methods: {
    executeTemplates(item,  type) {
      //this.$refs["showTemplates"].hide();
      this.$store.commit("setLoading", true);

      //console.log(item, index, "Execute temp");
      if (type !== "delete") {
        let foundData = null;
        Object.keys(this.templatesData).filter(
          (obj) => {
            if (obj === item.tempId) {
              foundData = this.templatesData[obj];
              return obj;
            } else return null;
          }
        );
        if (foundData && foundData.tempDetails && type !== "delete") {
          this.selectedDEs = foundData.tempDetails.selectedDEs;
          this.selectedOrg = foundData.tempDetails.selectedOrg;
          this.selectedName = foundData.tempName;
          this.customPeriod = [
            new Date(foundData.tempDetails.customPeriod[0]),
            new Date(foundData.tempDetails.customPeriod[1]),
          ];
          this.tempId = foundData.tempId;
          this.formType = "edit";
          //console.log("this.customPeriod", this.customPeriod);
          if (type === "execute") this.dataExport();
          else this.$store.commit("setLoading", false);
        }
      } else {
        //steps to remove data
        this.templatesData = Object.keys(this.templatesData)
          .filter((objKey, keyIndex) => objKey !== item.tempId)
          .reduce((newObj, key) => {
            newObj[key] = this.templatesData[key];
            return newObj;
          }, {});
        //update Config
        let key = this.generateKey("savedTemplates");

        service
          .updateConfig({
            data: this.templatesData,
            tableKey: key,
          })
          .then((resp) => {
            if (resp.data.status === "OK") {
              this.$swal({
                text: this.$i18n.t("dataDeleted"),
                icon: "success",
              });
            }
          })
          .catch((err) => {
            console.log("deleted action caused error");
          });

        this.$store.commit("setLoading", false);
        console.log(this.templatesData, "this.templatesData after deletion");
      }
    },
    // viewTemplates() {
    //   this.$refs["showTemplates"].show();
    // },
    // hideTemplates() {
    //   this.$refs["showTemplates"].hide();
    // },
    getTemplatesData() {
      let key = this.generateKey("savedTemplates");
      service
        .getSavedConfig({
          tableKey: key,
        })
        .then((resp) => {
          this.templatesData = resp.data;
        })
        .catch((err) => {
          console.log("Templates not found");
        });
    },
    nameOfDE(selectedDEs, dataElementList) {
      let deNameArr = [];
      let returnStr = "";
      selectedDEs.forEach((items) => {
        dataElementList.forEach((item) => {
          let isFound = item.children.filter((i) => {
            return i.id == items;
          });
          if (isFound) {
            deNameArr.push(isFound);
          }
        });
      });
      deNameArr = deNameArr.flat();
      deNameArr.forEach((i) => {
        returnStr = returnStr + i.label + ",";
      });
      return returnStr;
    },
    nameOfOrg(selectedOrg, orgOptionsUpdated) {
      let returnStr = "";

      selectedOrg.forEach((selectedId) => {
        const label = this.getLabelForId(selectedId, orgOptionsUpdated);
        if (label) {
          returnStr += label + ",";
        }
      });
      return returnStr;
    },

    getLabelForId(targetId, orgOptions) {
      for (const item of orgOptions) {
        if (item.id === targetId) {
          return item.label;
        }
        if (item.children) {
          const childLabel = this.getLabelForId(targetId, item.children);
          if (childLabel) {
            return childLabel;
          }
        }
      }
      return null;
    },
    saveTemplate() {
      this.$store.commit("setLoading", true);

      let tempNewId = randomString(5);
      let tempObj = {
        tempId: tempNewId,
        tempName: this.templateName,
        createdOn: this.$moment(new Date()).format("ll"),
        tempDetails: {
          selectedDEs: this.selectedDEs,
          selectedDEsName: this.nameOfDE(
            this.selectedDEs,
            this.dataElementList
          ),
          selectedOrg: this.selectedOrg,
          selectedOrgName: this.nameOfOrg(
            this.selectedOrg,
            this.orgOptionsUpdated
          ),
          customPeriod: this.customPeriod,
          selectedOrgLevel: this.selectedOrgLevel,
        },
      };
      // let finalObj={}
      // finalObj[tempNewId] = tempObj;
      let key = this.generateKey("savedTemplates");
      service
        .getSavedConfig({
          tableKey: key,
        })
        .then((resp) => {
          this.savedTemplates = resp.data;
          if (!this.savedTemplates) this.savedTemplates = {};
          this.savedTemplates[tempNewId] = tempObj;
          service
            .updateConfig({
              data: this.savedTemplates,
              tableKey: key,
            })
            .then((resp) => {
              if (resp.data.status === "OK") {
                this.templatesData = this.savedTemplates;
                this.rows = Object.keys(this.templatesData).length;
                if (this.formType != "edit") this.dataExport();
              }
            });
          this.$store.commit("setLoading", false);
        })
        .catch((err) => {
          if (!this.savedTemplates) this.savedTemplates = {};
          this.savedTemplates[tempNewId] = tempObj;
          service
            .saveConfig({
              data: this.savedTemplates,
              tableKey: key,
            })
            .then((resp) => {
              if (resp.data.status === "OK") {
                this.templatesData = this.savedTemplates;
                this.rows = Object.keys(this.templatesData).length;
                if (this.formType != "edit") this.dataExport();
              }
            });
          this.$store.commit("setLoading", false);
        });
      console.log(
        "this.savedTemplates",
        JSON.parse(JSON.stringify(this.savedTemplates))
      );
    },
    continueM() {
      if (
        this.selectedDEs.length > 0 &&
        this.selectedOrg.length > 0 &&
        this.selectedOrgLevel &&
        this.customPeriod.length > 0
      ) {
        console.log(this.formType, "this.formType", this.tempId);
        if (this.formType == "new") {
          this.$swal({
            title: this.$i18n.t("saveTemp"),
            input: "checkbox",
            inputValue: 1,
            inputPlaceholder: this.$i18n.t("doYouWantToSave"),
            confirmButtonText:
              this.$i18n.t("saveCont") +
              `&nbsp;<i class="fa fa-arrow-right"></i>`,
            showDenyButton: true,
            inputValidator: (result) => {
              return !result && this.$i18n.t("selectCheckbox");
            },
            denyButtonText: this.$i18n.t("exportandImportData"),
            denyButtonColor: "#3085d6",
            showCancelButton: true,
            cancelButtonText: this.$i18n.t("cancelbtn"),
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              this.$swal({
                title: this.$i18n.t("saveTemp"),
                input: "text",
                inputPlaceholder: this.$i18n.t("typeTemaplteName"),
                inputValidator: (result) => {
                  if (!result) {
                    return this.$i18n.t("enterTempName");
                  } else if (!this.checkNameList(result)) {
                    return this.$i18n.t("enterUniName");
                  }
                },
                confirmButtonText:
                  this.$i18n.t("saveCont") +
                  `&nbsp;<i class="fa fa-arrow-right"></i>`,
                showCancelButton: true,
                cancelButtonText: this.$i18n.t("cancelbtn"),
              }).then((result) => {
                if (result.isConfirmed) {
                  this.templateName = result.value;
                  this.saveTemplate();
                  this.$swal({
                    text: this.$i18n.t("dataSaved"),
                    icon: "success",
                  });
                }
              });
            } else if (result.isDenied) {
              this.dataExport();
            }
          });
        } else {
          this.$swal({
            text: this.$i18n.t("doYouWantToSaveExist"),
            confirmButtonText: this.$i18n.t("editExist"),
            showDenyButton: true,
            denyButtonText: this.$i18n.t("createNew"),
            denyButtonColor: "#3085d6",
            showCancelButton: true,
            cancelButtonText: this.$i18n.t("cancelbtn"),
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              //save exist temp

              console.log("save existing temp");
              // let isFound = null;
              Object.keys(this.templatesData).forEach((key) => {
                if (key === this.tempId) {
                  //isFound = this.templatesData[key]
                  this.templatesData[key]["name"] = this.templateName;
                  this.templatesData[key].tempDetails["customPeriod"] =
                    this.customPeriod;
                  this.templatesData[key].tempDetails["selectedDEs"] =
                    this.selectedDEs;
                  this.templatesData[key].tempDetails["selectedOrg"] =
                    this.selectedOrg;
                  this.templatesData[key].tempDetails["selectedOrgLevel"] =
                    this.selectedOrgLevel;
                  this.templatesData[key].tempDetails["selectedDEsName"] =
                    this.nameOfDE(this.selectedDEs, this.dataElementList);
                  this.templatesData[key].tempDetails["selectedOrgName"] =
                    this.nameOfOrg(this.selectedOrg, this.orgOptionsUpdated);
                }
              });
              let key = this.generateKey("savedTemplates");
              this.$store.commit("setLoading", true);
              service
                .getSavedConfig({
                  tableKey: key,
                })
                .then((resp) => {
                  console.log(
                    resp,
                    this.tempId,
                    this.templatesData[this.tempId]
                  );
                  this.$store.commit("setLoading", false);
                  this.savedTemplates = resp.data;
                  this.savedTemplates[this.tempId] =
                    this.templatesData[this.tempId];
                  service
                    .updateConfig({
                      data: this.savedTemplates,
                      tableKey: key,
                    })
                    .then((resp) => {
                      if (resp.data.status === "OK") {
                        this.templatesData = this.savedTemplates;
                        this.$swal({
                          text: this.$i18n.t("dataUpdated"),
                          icon: "success",
                        });
                      }
                    });
                })
                .catch((err) => {
                  this.$store.commit("setLoading", false);
                  console.log("err", err);
                });
            } else if (result.isDenied) {
              //save new temp
              this.$swal({
                title: this.$i18n.t("saveTemp"),
                input: "text",
                inputPlaceholder: this.$i18n.t("typeTemaplteName"),
                inputValidator: (result) => {
                  console.log("result", result, this.checkNameList(result));
                  if (!result) {
                    return this.$i18n.t("enterTempName");
                  } else if (!this.checkNameList(result)) {
                    return this.$i18n.t("enterUniName");
                  }
                },
                confirmButtonText:
                  this.$i18n.t("saveCont") +
                  `&nbsp;<i class="fa fa-arrow-right"></i>`,
                showCancelButton: true,
                cancelButtonText: this.$i18n.t("cancelbtn"),
              }).then((result) => {
                if (result.isConfirmed) {
                  this.templateName = result.value;
                  this.saveTemplate();
                  this.$swal({
                    text: this.$i18n.t("dataSaved"),
                    icon: "success",
                  });
                }
              });
            }
          });
        }
      } else {
        this.$store.commit("setLoading", false);
        // this.resetForm();
        this.sweetAlert({
          title: this.$i18n.t("error"),
          text: this.$i18n.t("pleaseSelect"),
        });
      }
    },
    checkNameList(checkThisName) {
      let found = "";
      Object.keys(this.templatesData).forEach((id) => {
        if (this.templatesData[id].tempName === checkThisName) {
          found = true;
        }
      });
      if (found) {
        return false;
      } else {
        return true;
      }
    },
    getDataSetPeriod(dsId) {
      let findDataSet = this.$store.getters.getDataSetList.find(
        (obj) => obj.id === dsId
      );
      return findDataSet?.["periodType"] || "Monthly";
    },
    async getLocationList() {
      // console.log("getLocationList", this.$store.getters.getLocationList);

      if (!this.$store.getters.getLocationList) {
        // Get the locationID & levelID from the 'getAllowedLocation()' function available in 'service.js' file.
        try {
          let { locationID, levelID } = service.getAllowedLocation();
          // Fetch all available locations based on the locationID & levelID. We will get the nested location list.
          let response = await service.getOrganisationChildren(
            locationID,
            levelID,
            true
          );
          // Convert the location list in the 'vue-treeselect' format
          const renamedObj = service.renameKeys(response.data);
          this.orgOptions = JSON.parse(JSON.stringify([renamedObj]));

          this.$store.commit("setLocationList", [renamedObj]); // Set the location list in store
        } catch (err) {
          this.orgOptions = [];
          console.log("Error in fetching location list...", err);
        }
      } else {
        this.orgOptions = JSON.parse(
          JSON.stringify(this.$store.getters.getLocationList)
        );
      }
    },
    dataExport() {
      this.$store.commit("setLoading", true);
      this.$store.commit("setLoadingText", "Data upload process started");
      if (
        this.selectedDEs.length > 0 &&
        this.selectedOrg.length > 0 &&
        this.selectedOrgLevel &&
        this.customPeriod.length > 0
      ) {
        // let date1 = new Date(this.customPeriod[0]).format("dd-mm-yyyy");
        let monthlyPeriodArr = [],
          annualPeriodArr = [];

        // if (this.dataSetPeriod === "Monthly") {
        let dateM1 = this.$moment(this.customPeriod[0]).format("YYYYMM");
        let dateM2 = this.$moment(this.customPeriod[1]).format("YYYYMM");
        // console.log(dateM1, dateM2, "customPeriod");
        let startDate = this.$moment(dateM1),
          endDate = this.$moment(dateM2).add(1, "month");
        // endDate = this.$moment(this.sourceEndYear).add(1, "year"),

        while (startDate.isBefore(endDate)) {
          monthlyPeriodArr.push(startDate.format("YYYYMM"));
          startDate.add(1, "month");
        }
        // } else {
        let date1 = this.$moment(this.customPeriod[0]).format("YYYY") * 1;
        let date2 = this.$moment(this.customPeriod[1]).format("YYYY") * 1;

        annualPeriodArr = [date1];
        while (date1 < date2) {
          annualPeriodArr.push(++date1);
        }
        // }
        let getMonthDEList = [],
          annualDEList = [];
        this.selectedDEs.forEach((sDE) => {
          this.dataElementList.forEach((obj) => {
            obj.children.forEach((innerObj) => {
              if (innerObj.id === sDE && innerObj.periodType === "Monthly") {
                if (!getMonthDEList.includes(sDE)) getMonthDEList.push(sDE);
              }
              if (innerObj.id === sDE && innerObj.periodType === "Yearly") {
                if (!annualDEList.includes(sDE)) annualDEList.push(sDE);
              }
            });
          });
        });
        // console.log(getMonthDEList, annualDEList, "DELIST period wise");
        this.getApiData(
          getMonthDEList,
          monthlyPeriodArr,
          annualDEList,
          annualPeriodArr
        );
      } else {
        this.$store.commit("setLoading", false);
        this.resetForm();
        this.sweetAlert({
          title: this.$i18n.t("error"),
          text: this.$i18n.t("pleaseSelect"),
        });
      }
    },
    async dataChunkLogic(chunks, chunkSize = 200) {
      this.uploadChunkLogs = {};
      this.uploadChunkLogs["TotalChunks"] = chunks.length;
      this.uploadChunkLogs["successCount"] = 0;
      this.uploadChunkLogs["failureCount"] = 0;
      this.uploadChunkLogs["failureChunks"] = [];
      // this.$store.commit(
      //   "setLoadingText",
      //   "Total " + chunks.length + "chunks are created "
      // );
      for (let [index, oneChunk] of chunks.entries()) {
        console.log(index, oneChunk, "index, oneChunk");
        if (oneChunk.length) {
          //Upload item model API Call
          let fileWithChunk = {};
          fileWithChunk.dataValues = oneChunk;

          console.log(
            this.uploadChunkLogs,
            "this.uploadChunkLogs",
            fileWithChunk,
            index
          );
          let recordCount = chunkSize * 1 * (index + 1);
          recordCount =
            recordCount > this.finalIncJson.dataValues.length
              ? this.finalIncJson.dataValues.length
              : recordCount;
          this.$store.commit(
            "setLoadingText",
            "Data Uploading for " +
              recordCount +
              " of " +
              this.finalIncJson.dataValues.length +
              " records."
          );
          await this.fileUpload(fileWithChunk);
          if (index === chunks.length - 1) {
            this.$store.commit("setLoading", false);
            let html =
              "<div><p>Total chunks created are : <b>" +
              this.uploadChunkLogs["TotalChunks"] +
              "</b></p><p>Total chunks uploaded are : <b>" +
              this.uploadChunkLogs["successCount"] +
              "</b></p><p>Failed chunk count : <b>" +
              this.uploadChunkLogs["failureCount"] +
              "</b></p></div>";
            console.log(this.uploadChunkLogs, "this.uploadChunkLogs");
            this.$swal({
              title: this.$i18n.t("uploadStatus"),
              text: this.$i18n.t("dataUpdated"),
              showConfirmButton:
                this.uploadChunkLogs["failureCount"] > 0 ? true : false,
              confirmButtonText: this.$i18n.t("reTry"),
              showDenyButton: true,
              denyButtonText: this.$i18n.t("ok"),
              denyButtonColor: "#3085d6",
            }).then((result) => {
              console.log(result);
              if (result.isConfirmed) {
                this.dataChunkLogic(this.uploadChunkLogs["failureChunks"], 200);
              }
            });
            this.resetForm();
          }

          // console.log(
          //   this.uploadChunkLogs?.["chunksStatus"]?.[
          //     "Chunk" + chunks.length - 1
          //   ]?.["SUCCESS"]
          // );
          // if (
          //   Object.keys(this.uploadChunkLogs["chunksStatus"]) ===
          //   chunks.length
          // ) {
          //   this.$store.commit("setLoading", false);
          // }
        } else {
          // //Inside item price details
          // console.log("inside item price");
          // //API call for fetching price info
          // this.getitemPriceInfo(item.id);
        }
      }
    },
    async getApiData(sDEs, periodArr, annualDEs, annualArr) {
      this.finalIncJson["dataValues"] = [];
      let promises = [];
      if (sDEs.length > 0) {
        let indID = sDEs.join(";");
        let locationArr = this.selectedOrg.map((loc) => loc.split("/")[1]);
        let location = locationArr.join(";");
        let level = [this.selectedOrgLevel];
        let pe = periodArr.join(";");
        promises.push(
          service.getIndicatorData(
            indID,
            level,
            location,
            pe,
            null,
            null,
            null,
            null,
            null,
            true
          )
        );
      }
      if (annualDEs.length > 0) {
        let indID = annualDEs.join(";");
        let locationArr = this.selectedOrg.map((loc) => loc.split("/")[1]);
        let location = locationArr.join(";");
        let level = [this.selectedOrgLevel];
        let pe = annualArr.join(";");
        promises.push(
          service.getIndicatorData(
            indID,
            level,
            location,
            pe,
            null,
            null,
            null,
            null,
            null,
            true
          )
        );
      }
      let noDataFound = true;
      await Promise.allSettled(promises).then((results) => {
        results.forEach((response, i) => {
          if (response.status === "fulfilled") {
            if (response.value.data.rows.length > 0) {
              noDataFound = false;
              this.formatExportedData(response.value.data.rows);
            }
            console.log(response, "response");
          } else {
          }
        });
      });
      console.log(noDataFound, this.finalIncJson.dataValues);
      if (!noDataFound && this.finalIncJson.dataValues.length > 0) {
        let chunkSize = 200;
        let chunks = chunk(this.finalIncJson.dataValues, chunkSize);
        console.log(chunks, "chunks");
        this.dataChunkLogic(chunks, chunkSize);
      } else {
        this.resetForm();
        this.sweetAlert({
          title: this.$i18n.t("error"),
          text: this.$i18n.t("noData"),
        });
        this.$store.commit("setLoading", false);
      }

      //     .then((resp) => {
      //       if (resp && resp.data && resp.data.rows.length) {
      //         this.formatExportedData(resp.data.rows);
      //       } else {
      //         this.$store.commit("setLoading", false);
      //         //this.resetForm();
      //         // this.sweetAlert({
      //         //   title: this.$i18n.t("error"),
      //         //   text: this.$i18n.t("noData"),
      //         // });
      //       }
      //     })
      //     .catch((err) => {
      //       this.$store.commit("setLoading", false);
      //       this.resetForm();
      //       // this.sweetAlert({
      //       //   title: this.$i18n.t("error"),
      //       //   text: this.$i18n.t("somethingWentWrong"),
      //       // });
      //     });
      // } else {
      //   // console.log("noDataFound");
      // }
    },
    newLocList(orgList, level) {
      // console.log("calling newLoclist", orgList, level);
      let list = [];
      list = orgList.map((loc) => {
        // console.log(loc.level, level * 1, "in map function");
        if (loc.level > level * 1) {
          loc.isDisabled = true;
        } else {
          //loc.isDisabled = false;
        }
        if (loc.children) {
          loc.children = this.newLocList(loc.children, level);
        }
        return loc;
      });
      // console.log(
      //   JSON.parse(JSON.stringify(list)),
      //   "list from newList function"
      // );
      return list;
    },
    async getDataElementList() {
      this.dataElementList = [];
      if (this.dataSetList !== null) {
        for (let set in this.selectedDataSet) {
          // console.log(this.selectedDataSet[set]);
          let name = this.dataSetList.filter(
            (item) => item.id == this.selectedDataSet[set]
          );
          let dataSetPeriod = this.getDataSetPeriod(name[0].id);
          // this.$store.commit("setLoading", true);
          await service
            .getDataElementsByDataSets(this.selectedDataSet[set], true)
            .then((resp) => {
              let isFound = resp.data.dataElements.filter(
                (obj) => this.dataEleSync[obj.id]
              );

              // console.log(isFound, "isFound");
              let arr = [];
              if (isFound && isFound.length > 0) {
                arr.push({
                  id: name[0].id,
                  label: name[0].label + `(${dataSetPeriod})`,
                  children: isFound.map((obj) => {
                    return {
                      id: obj.id,
                      label: obj.displayName,
                      periodType: dataSetPeriod,
                    };
                  }),
                });
              }
              if (arr.length > 0) this.dataElementList.push(arr[0]);
              // console.log("this.dataElementList", this.dataElementList);
            })
            .catch((err) => {
              console.log(err, "errr");
            });
        }
      }
      // this.$store.commit("setLoading", false);
    },
    async formatExportedData(expData) {
      // console.log(expData);
      // let finalIncJson = {
      //   dataValues: [],
      // };
      expData.forEach((obj) => {
        // console.log(obj, "obj");
        if (this.dataEleSync[obj[0]]?.["LiveInstance"]) {
          let innerObj = {
            dataElement: this.dataEleSync[obj[0]]?.["LiveInstance"],
            period: obj[1],
            orgUnit: obj[2],
            value: obj[3] * 1,
          };
          this.finalIncJson["dataValues"].push(innerObj);
        }
      });
    },
    async finalUploadStatus(uploadID) {
      await service
        .showTaskSumm(uploadID)
        .then((taskResp) => {
          console.log(taskResp, "taskResp");

          if (taskResp && taskResp.data && taskResp.data.status === "SUCCESS") {
            this.uploadChunkLogs["successCount"] =
              this.uploadChunkLogs["successCount"] * 1 + 1;
            // this.resetForm();
            // this.sweetAlert({
            //   title: this.$i18n.t("success"),
            //   text: this.$i18n.t("dataImportedSuccessfully"),
            // });
          } else if (
            taskResp &&
            taskResp.data &&
            taskResp.data.status === "WARNING"
          ) {
            this.uploadChunkLogs["successCount"] =
              this.uploadChunkLogs["successCount"] * 1 + 1;
            //this.$store.commit("setLoading", false);
            // this.resetForm();
            // this.sweetAlert({
            //   title: this.$i18n.t("success"),
            //   text: this.$i18n.t("dataImportedSuccessfully"),
            // });
          } else {
            setTimeout(async () => {
              await this.finalUploadStatus(uploadID);
            }, 5000);

            // this.$store.commit("setLoading", false);
            // this.resetForm();
            // this.sweetAlert({
            //   title: this.$i18n.t("error"),
            //   text: this.$i18n.t("somethingWentWrong"),
            // });
          }
        })
        .catch(async (err) => {
          console.log(err, "err to check err type");
          await this.finalUploadStatus(uploadID);
          //this.$store.commit("setLoading", false);
          //this.resetForm();
          // this.sweetAlert({
          //   title: this.$i18n.t("error"),
          //   text: this.$i18n.t("somethingWentWrong"),
          // });
          //         this.$swal({
          //           title: this.$i18n.t("saveTemp"),
          //           text: "Some network error occured. Please retry",
          //           // input: "checkbox",
          //           // inputValue: 1,
          //           // inputPlaceholder: this.$i18n.t("doYouWantToSave"),
          //           confirmButtonText:
          //             this.$i18n.t("reTry") +
          //             `&nbsp;<i class="fa fa-arrow-repeat"></i>
          // `,
          //           // showDenyButton: true,
          //           // inputValidator: (result) => {
          //           //   return !result && this.$i18n.t("selectCheckbox");
          //           // },
          //           // denyButtonText: this.$i18n.t("exportandImportData"),
          //           // denyButtonColor: "#3085d6",
          //           showCancelButton: true,
          //           cancelButtonText: this.$i18n.t("cancelbtn"),
          //         }).then((result) => {
          //           /* Read more about isConfirmed, isDenied below */
          //           if (result.isConfirmed) {
          //             this.$store.commit("setLoading", true);
          //             this.finalUploadStatus(uploadID);
          //           }
          //         });
        });
    },
    async fileUpload(fileJson) {
      await service
        .uploadJson(fileJson)
        .then((resp) => {
          if (resp && resp.data && resp.data.status === "OK") {
            return resp;
          } else {
            // this.$store.commit("setLoading", false);
            // this.resetForm();
            // this.sweetAlert({
            //   title: this.$i18n.t("error"),
            //   text: this.$i18n.t("somethingWentWrong"),
            // });
          }
        })
        .then(async (resp) => {
          let uploadID = resp.data.response["id"];
          await service
            .showTask(uploadID)
            .then((tResp) => {
              console.log(tResp, "tResp");
              // if (tResp && tResp.data.length > 0) {
              //   //let reversed = tResp.data.reverse();
              //   // this.$store.commit(
              //   //   "setLoadingText",
              //   //   "Upload status of chunk " + chunkIndex
              //   // );
              //   // reversed.forEach((obj) => {
              //   //   this.$store.commit("setLoadingText", obj.message);
              //   // });
              // }
              return tResp;
            })
            .then(async () => {
              console.log("Calling this.finalUploadStatus");
              await this.finalUploadStatus(uploadID);
            })
            .catch((err) => {
              this.uploadChunkLogs["failureChunks"].push(fileJson.dataValues);
              this.uploadChunkLogs["failureCount"] =
                this.uploadChunkLogs["failureCount"] * 1 + 1;
              // this.$store.commit("setLoading", false);
              // this.resetForm();
              // this.sweetAlert({
              //   title: this.$i18n.t("error"),
              //   text: this.$i18n.t("somethingWentWrong"),
              // });
            });
        })
        .catch((err) => {
          this.uploadChunkLogs["failureChunks"].push(fileJson.dataValues);
          this.uploadChunkLogs["failureCount"] =
            this.uploadChunkLogs["failureCount"] * 1 + 1;
          this.resetForm();
          this.$store.commit("setLoading", false);
        });
    },
    resetForm() {
      this.selectedDEs = [];
      this.selectedName = "";
      //this.selectedDataSet = null;
      this.dataSetPeriod = "";
      this.selectedOrg = [];
      // this.dataElementList = [];
      this.customPeriod = [];
      this.formType = "new";
    },
    // selectAll() {
    //   let _t = this;
    //   _t.dataElementList.forEach((item) => {
    //     if (!_t.selectedDEs.includes(item.id)) _t.selectedDEs.push(item.id);
    //   });
    // },
    selectAll() {
      //console.log("this function getting called", node);
      let _t = this;
      // console.log(_t.selectedDEs.length, _t.dataElementList.length, "length");
      if (_t.selectedDEs.includes("all")) {
        _t.selectedDEs = [];
        _t.dataElementList.forEach((item) => {
          //if (item.id != "all") {
          if (!_t.selectedDEs.includes(item.id)) _t.selectedDEs.push(item.id);
          //}
        });
      } else if (
        !_t.selectedDEs.includes("all") &&
        _t.selectedDEs.length === _t.dataElementList.length - 1
      ) {
        _t.selectedDEs = [];
      }
    },
    deSelectAll() {
      let _t = this;

      //if (node.id == "all") {
      _t.selectedDEs = [];
      // }
    },
  },
  created() {
    this.getLocationList();
    this.getDataElementList();
    this.getTemplatesData();
  },
};
</script>
