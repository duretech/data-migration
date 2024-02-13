<template>
  <div class="row mt-2">
    <div class="col-lg-12">
      <!-- <div class="row d-flex justify-content-end mx-4">
        <b-button
          class="col-sm-3 w-auto btn-view mb-3"
          @click="viewTemplates()"
        >
          <img
            src="../../assets/images/icons/templateicon.svg"
            v-b-tooltip.hover
            :title="$t('viewTeamp')"
            style="height: 20px"
          />
          <span class="mx-2">
            {{ $t("viewTeamp") }}
          </span>
        </b-button>
        <b-modal
          ref="showTemplates"
          id="showTemplates"
          hide-footer
          centered
          size="xl"
          :title="$t('viewTeamp')"
          :cancel-title="$t('cancelbtn')"
          no-close-on-backdrop
        >
          <div class="row mx-0">
            <b-table
              id="trans-table"
              responsive
              sticky-header
              bordered
              hover
              :empty-text="$t('no_data_to_display')"
              :empty-filtered-text="$t('no_data_to_display')"
              :per-page="perPage"
              :current-page="currentPage"
              :fields="tempFields"
              :items="tempItems"
              show-empty
            >
            
              <template #cell()="data">
                <span v-html="data.value"></span>
              </template>
              <template #cell(edit)="data">
                <img
                  :src="require('@/assets/images/icons/editActive.svg')"
                  class="img-fluid w-24 cursor-pointer edit-img"
                  v-b-tooltip.hover
                  :title="$t('edit')"
                  @click="executeTemplates(data.item, data.index, 'edit')"
                />
              </template>
              <template #cell(view)="row">
                <img
                  :src="require('@/assets/images/icons/view-updatedicon.svg')"
                  class="img-fluid w-24 cursor-pointer edit-img"
                  v-b-tooltip.hover
                  :title="$t('view')"
                  @click="row.toggleDetails"
                />
              </template>
              <template #row-details="row">
                <b-card>
                  <b-row class="mb-2">
                    <b-col sm="3" class="text-sm-right"
                      ><b>{{ $t("selectionofDataElements") }} : </b></b-col
                    >
                    <b-col>{{ row.item.tempDetails.selectedDEsName }}</b-col>
                  </b-row>
                  <b-row class="mb-2">
                    <b-col sm="3" class="text-sm-right"
                      ><b>{{ $t("selectionOfOrganization") }}: </b></b-col
                    >
                    <b-col>{{ row.item.tempDetails.selectedOrgName }}</b-col>
                  </b-row>
                  <b-row class="mb-2">
                    <b-col sm="3" class="text-sm-right"
                      ><b>{{ $t("period") }}: </b></b-col
                    >
                    <b-col>{{
                      $moment(row.item.tempDetails.customPeriod[0]).format(
                        "ll"
                      ) +
                      " - " +
                      $moment(row.item.tempDetails.customPeriod[1]).format("ll")
                    }}</b-col>
                  </b-row>
                  <b-row class="mb-2">
                    <b-col sm="3" class="text-sm-right"
                      ><b>{{ $t("selectionOfLevel") }} : </b></b-col
                    >
                    <b-col>{{ row.item.tempDetails.selectedOrgLevel }}</b-col>
                  </b-row>

                  <b-button size="sm" @click="row.toggleDetails"
                    >Hide Details</b-button
                  >
                </b-card>
              </template>
              <template #cell(execute)="data">
                <img
                  :src="require('@/assets/images/icons/execute-icon.svg')"
                  class="img-fluid w-24 cursor-pointer edit-img"
                  v-b-tooltip.hover
                  :title="$t('edit')"
                  @click="executeTemplates(data.item, data.index, 'execute')"
                />
              </template>
              <template #empty="scope">
                <h5 class="text-center">{{ scope.emptyText }}</h5>
              </template>
              <template #emptyfiltered="scope">
                <h5 class="text-center">
                  {{ scope.emptyFilteredText }}
                </h5>
              </template>
            </b-table>
            <div>
              <b-pagination
                v-model="currentPage"
                :total-rows="rows"
                :per-page="perPage"
                aria-controls="trans-table"
                align="center"
              ></b-pagination>
            </div>
          </div>
        </b-modal>
      </div> -->
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
                  range
                  class="form-control ml-2 p-0"
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
      <!-- <div class="form-group row mt-3">
        <label for="inputDefaultLevelID" class="col-sm-3 col-form-label">{{
          $t("selectionofDataSet")
        }}</label>
        <div class="col-sm-9">
          <div class="select-wrapper">
            <b-col cols="12" class="footer-col pt-1">
              <div class="loc-col mr-3">
                <treeselect
                  :options="dataSetList"
                  :show-count="true"
                  :multiple="true"
                  :load-options="loadOptions"
                  :placeholder="$t('search')"
                  v-model="selectedDataSet"
                  :flat="false"
                  :default-expand-level="1"
                  @open="
                    openM1 = false;
                    openY1 = false;
                  "
                />
              </div>
            </b-col>
          </div>
        </div>
      </div> -->
      <div class="form-group row mt-3">
        <label for="dataElementList" class="col-sm-3 col-form-label">{{
          $t("selectionofDataElements")
        }}</label>
        <div class="col-sm-9">
          <div class="select-wrapper">
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
            $t("exportandImportData")
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
      selectedDEs: [],
      selectedOrg: [],
      dataElementList: [],
      orgOptions: [],
      orgOptionsUpdated: [],
      customPeriod: [],
      templateName: "",
      finalIncJson: {
        dataValues: [],
      },
      savedTemplates: null,
      // tempFields: [],
      // tempItems: [],
      templatesData: null,
      // currentPage: 1,
      // perPage: 10,
      // rows: 0,
      executeableObj: null,
    };
  },
  watch: {
    emitObj: {
      handler(newVal) {
        this.executeableObj = newVal;
      },
      deep: true,
    },
    executeableObj: {
      handler(newVal) {
        console.log("emiitede from header", newVal);
        this.executeTemplates(newVal.item, newVal.index, newVal.type);
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
    executeTemplates(item, index, type) {
      //this.$refs["showTemplates"].hide();
      this.$store.commit("setLoading", true);

      console.log(item, index, "Execute temp");
      if (type !== "delete") {
        let foundData = null;
        let executeData = Object.keys(this.templatesData).filter(
          (obj, objInd) => {
            console.log(obj, objInd, index);
            if (objInd === index) {
              foundData = this.templatesData[obj];
              return obj;
            } else return null;
          }
        );
        if (foundData && foundData.tempDetails && type !== "delete") {
          this.selectedDEs = foundData.tempDetails.selectedDEs;
          this.selectedOrg = foundData.tempDetails.selectedOrg;
          //this.selectedOrgLevel = foundData.tempDetails.selectedOrgLevel;
          this.customPeriod = foundData.tempDetails.customPeriod;
          if (type === "execute") this.dataExport();
          else this.$store.commit("setLoading", false);
        }
      } else {
        //steps to remove data
        this.templatesData = Object.keys(this.templatesData)
          .filter((objKey, keyIndex) => keyIndex !== index)
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
              this.sweetAlert({
                title: this.$i18n.t("success"),
                text: this.$i18n.t("dataDeleted"),
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
          this.tempFields = [
            { key: "name", label: this.$i18n.t("name") },
            { key: "createdOn", label: this.$i18n.t("createdOn") },
            {
              key: "edit",
              label: this.$i18n.t("edit"),
            },
            {
              key: "view",
              label: this.$i18n.t("view"),
            },
            {
              key: "execute",
              label: this.$i18n.t("execute"),
            },
          ];
          Object.keys(this.templatesData).forEach((keys) => {
            let rows = {};
            rows["name"] = this.templatesData[keys]["tempName"];
            rows["createdOn"] = this.templatesData[keys]["createdOn"];
            rows["tempDetails"] = this.templatesData[keys]["tempDetails"];
            this.tempItems.push(rows);
          });
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
                this.dataExport();
              }
            });
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
                this.dataExport();
              }
            });
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
        this.$swal({
          title: this.$i18n.t("saveTemp"),
          input: "checkbox",
          inputValue: 1,
          inputPlaceholder: this.$i18n.t("doYouWantToSave"),
          confirmButtonText:
            this.$i18n.t("saveCont") +
            `&nbsp;<i class="fa fa-arrow-right"></i>
  `,
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
                return !result && this.$i18n.t("enterTempName");
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
                // this.$swal({
                //   title: this.$i18n.t("saveTemp"),
                //   text: "Your template saved",
                // });
              }
            });
          } else if (result.isDenied) {
            this.dataExport();
          }
        });
      } else {
        this.$store.commit("setLoading", false);
        // this.resetForm();
        this.sweetAlert({
          title: this.$i18n.t("error"),
          text: this.$i18n.t("pleaseSelect"),
        });
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
    async getApiData(sDEs, periodArr, annualDEs, annualArr) {
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
        this.fileUpload();
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
          this.$store.commit("setLoading", true);
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
      this.$store.commit("setLoading", false);
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
    async fileUpload() {
      await service
        .uploadJson(this.finalIncJson)
        .then((resp) => {
          if (resp && resp.data && resp.data.status === "OK") {
            return resp;
          } else {
            this.$store.commit("setLoading", false);
            this.resetForm();
            this.sweetAlert({
              title: this.$i18n.t("error"),
              text: this.$i18n.t("somethingWentWrong"),
            });
          }
        })
        .then((resp) => {
          let uploadID = resp.data.response["id"];
          service
            .showTask(uploadID)
            .then((tResp) => {
              return tResp;
            })
            .then(() => {
              service.showTaskSumm(uploadID).then((taskResp) => {
                if (
                  taskResp &&
                  taskResp.data &&
                  taskResp.data.status === "SUCCESS"
                ) {
                  this.$store.commit("setLoading", false);
                  this.resetForm();
                  this.sweetAlert({
                    title: this.$i18n.t("success"),
                    text: this.$i18n.t("dataImportedSuccessfully"),
                  });
                } else if (
                  taskResp &&
                  taskResp.data &&
                  taskResp.data.status === "WARNING"
                ) {
                  this.$store.commit("setLoading", false);
                  this.resetForm();
                  this.sweetAlert({
                    title: this.$i18n.t("success"),
                    text: this.$i18n.t("dataImportedSuccessfully"),
                  });
                } else {
                  this.$store.commit("setLoading", false);
                  this.resetForm();
                  this.sweetAlert({
                    title: this.$i18n.t("error"),
                    text: this.$i18n.t("somethingWentWrong"),
                  });
                }
              });
            })
            .catch((err) => {
              this.$store.commit("setLoading", false);
              this.resetForm();
              this.sweetAlert({
                title: this.$i18n.t("error"),
                text: this.$i18n.t("somethingWentWrong"),
              });
            });
        })
        .catch((err) => {
          this.resetForm();
          this.$store.commit("setLoading", false);
        });
    },
    resetForm() {
      this.selectedDEs = [];
      //this.selectedDataSet = null;
      this.dataSetPeriod = "";
      this.selectedOrg = [];
      // this.dataElementList = [];
      this.customPeriod = [];
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
