<template>
  <nav class="navbar">
    <div class="container-fluid">
      <div class="navbar-brand">
        <img
          src="../../assets/images/migration-logo.png"
          class="home-logo me-3"
        />
        <span>{{ $t("title") }}</span>
      </div>

      <div class="d-flex align-items-center">
        <template>
          <b-button class="ml-2 me-3" @click="viewTemplates()">
            <img
              src="../../assets/images/icons/templateicon.svg"
              v-b-tooltip.hover
              :title="$t('viewTeamp')"
              style="height: 20px"
            />
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
              <b-form-input
                class="w-25 m-3"
                id="filter-input"
                v-model="filter"
                type="search"
                placeholder="Type to Search"
              ></b-form-input>
              <b-table
                id="trans-table"
                responsive
                sticky-header
                bordered
                hover
                :empty-text="$t('no_data_to_display')"
                :empty-filtered-text="$t('no_data_to_display')"
                per-page="10"
                :current-page="currentPage"
                :fields="tempFields"
                :items="tempItems"
                show-empty
                :filter="filter"
                filter-included-fields="name"
                @filtered="onFiltered"
              >
                <!-- at line 90   <i
                          class="fa fa-edit cursor-pointer"
                          v-b-tooltip.hover
                          :title="$t('edit')"
                          @click="editTranslation(data)"
                        ></i> -->
                <template #cell()="data">
                  <span v-html="data.value"></span>
                </template>
                <template #cell(edit)="data">
                  <button class="b-transparent p-0 border-transparent m-0">
                    <img
                      :src="require('@/assets/images/icons/editActive.svg')"
                      class="img-fluid w-24 cursor-pointer edit-img"
                      v-b-tooltip.hover
                      :title="$t('edit')"
                      @click="
                        executeTemplates({
                          item: data.item,
                          index: data.index,
                          type: 'edit',
                        })
                      "
                    />
                  </button>
                </template>
                <template #cell(view)="row">
                  <button class="b-transparent p-0 border-transparent m-0">
                    <img
                      :src="
                        require('@/assets/images/icons/view-updatedicon.svg')
                      "
                      class="img-fluid w-24 cursor-pointer edit-img"
                      v-b-tooltip.hover
                      :title="$t('view')"
                      @click="row.toggleDetails"
                    />
                  </button>
                </template>
                <template #row-details="row">
                  <b-card>
                    <b-row class="mb-2">
                      <b-col sm="2" class="text-sm-right"
                        ><b>{{ $t("selectionofDataElements") }} : </b></b-col
                      >
                      <b-col>
                        <p class="para-text">
                          {{ row.item.tempDetails.selectedDEsName }}
                        </p>
                      </b-col>
                    </b-row>
                    <b-row class="mb-2">
                      <b-col sm="2" class="text-sm-right"
                        ><b>{{ $t("selectionOfOrganization") }}: </b></b-col
                      >
                      <b-col>{{ row.item.tempDetails.selectedOrgName }}</b-col>
                    </b-row>
                    <b-row class="mb-2">
                      <b-col sm="2" class="text-sm-right"
                        ><b>{{ $t("period") }}: </b></b-col
                      >
                      <b-col>{{
                        $moment(row.item.tempDetails.customPeriod[0]).format(
                          "ll"
                        ) +
                        " - " +
                        $moment(row.item.tempDetails.customPeriod[1]).format(
                          "ll"
                        )
                      }}</b-col>
                    </b-row>
                    <b-row class="mb-2">
                      <b-col sm="2" class="text-sm-right"
                        ><b>{{ $t("selectionOfLevel") }} : </b></b-col
                      >
                      <b-col>{{ row.item.tempDetails.selectedOrgLevel }}</b-col>
                    </b-row>

                    <b-button size="sm" @click="row.toggleDetails"
                      >Hide Details</b-button
                    >
                  </b-card>
                </template>
                <template #cell(delete)="data">
                  <button class="b-transparent p-0 border-transparent m-0">
                    <img
                      :src="
                        require('@/assets/images/icons/Icon material-delete-forever.svg')
                      "
                      class="img-fluid w-24 cursor-pointer edit-img"
                      v-b-tooltip.hover
                      :title="$t('delete')"
                      @click="
                        executeTemplates({
                          item: data.item,
                          index: data.index,
                          type: 'delete',
                        })
                      "
                    />
                  </button>
                </template>
                <template #cell(execute)="data">
                  <b-button class="b-transparent p-0 border-transparent m-0">
                    <img
                      :src="require('@/assets/images/icons/execute-icon.svg')"
                      class="img-fluid w-24 cursor-pointer edit-img"
                      v-b-tooltip.hover
                      :title="$t('execute')"
                      @click="
                        executeTemplates({
                          item: data.item,
                          index: data.index,
                          type: 'execute',
                        })
                      "
                    />
                  </b-button>
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
              <b-pagination
                v-model="currentPage"
                :total-rows="totalRows"
                per-page="10"
                aria-controls="my-table"
                align="center"
              ></b-pagination>
            </div>
          </b-modal>
        </template>
        <template>
          <!-- langChange is function defined in mixin -->
          <LanguageChange @langChange="langChange" class="langChange" />
        </template>
        <!-- Settings Dropdown -->
        <div>
          <b-dropdown
            size="lg"
            id="dropdown-right"
            right
            text="Right align"
            variant="link"
            toggle-class="text-decoration-none"
            class="setting-dropdown"
            no-caret
          >
            <template #button-content>
              <img
                src="../../assets/images/icons/Icon ionic-ios-settings.svg"
                class="mx-3"
                v-b-tooltip.hover
                :title="$t('setting')"
              />
            </template>
            <b-dropdown-text class="text-center font-14 border-bottom-header">
              <div class="profilebox-upper">
                <div class="profilebox-upper-left">
                  <div class="text-body profile-text">
                    {{ profileInitials }}
                  </div>
                </div>
              </div>
              <!-- <b-avatar variant="primary"></b-avatar> -->
              <div class="text-capitalize pt-1">
                {{ userName }}
              </div>
              <div>
                {{ $store.getters.getAppVersion }}
              </div>
            </b-dropdown-text>
            <b-dropdown-item
              href="#"
              @click.prevent.stop="uploadConfigPopup"
              :title="$t('uploadConfigFiles')"
              v-b-tooltip.hover
            >
              <img
                src="@/assets/images/icons/upload-icon.svg"
                :style="{ filter: filterColor }"
                class="mx-3 me-3"
              />
              {{ $t("uploadConfig") }}
            </b-dropdown-item>
            <UploadConfig
              :uploadConfig="uploadConfig"
              @uploadSuccess="uploadSuccess"
              @hideModal="uploadConfig = false"
            />
            <b-dropdown-item
              href="#"
              @click.prevent.stop="downloadConfig"
              :title="$t('backupDatastore')"
              v-b-tooltip.hover
            >
              <img
                src="@/assets/images/icons/backup-config1.svg"
                :style="{ filter: filterColor }"
                class="mx-3 me-3"
              />
              {{ $t("backup_config") }}
            </b-dropdown-item>
            <b-dropdown-item
              href="#"
              class="mx-1"
              @click="clearCache"
              :title="$t('clearCache')"
              v-b-tooltip.hover
            >
              <img
                src="@/assets/images/icons/Icon material-refresh.svg"
                class="drop-img mx-3 me-3"
              />
              {{ $t("clearCache") }}
            </b-dropdown-item>
            <b-dropdown-item
              href="#"
              class="mx-1"
              @click.prevent.stop="addTranslations"
              :title="$t('addTranslations')"
              v-b-tooltip.hover
            >
              <img
                src="@/assets/images/icons/plusicon.svg"
                :style="{ filter: filterColor }"
                class="mx-3 drop-img me-3"
              />
              {{ $t("addTranslations") }}
            </b-dropdown-item>
            <b-modal
              v-model="addTranslation"
              hide-footer
              centered
              size="xl"
              :title="$t('addTranslations')"
              :cancel-title="$t('cancelbtn')"
              no-close-on-backdrop
            >
              <div class="row mx-0">
                <div class="col-7 border-right px-0" :key="updateDOM">
                  <div class="row mx-0 pb-3">
                    <div class="col-9 px-1">
                      <b-form-input
                        v-model="searchText"
                        :placeholder="$t('search')"
                      ></b-form-input>
                    </div>
                    <div
                      class="col-3 d-flex justify-content-end button-dropdown"
                    >
                      <download-csv :data="translationArray" class="mx-1">
                        <b-button>
                          <img
                            :src="
                              require(`@/assets/images/icons/downloadActive.svg`)
                            "
                            :style="{ filter: filterColor }"
                            v-b-tooltip.hover
                            :title="$t('downloadIcon')"
                            class="img-fluid"
                        /></b-button>
                      </download-csv>
                      <b-button @click="showUploadCsv()">
                        <img
                          :src="require(`@/assets/images/icons/UploadIcon.svg`)"
                          :style="{ filter: filterColor }"
                          v-b-tooltip.hover
                          :title="$t('UploadIcon')"
                          class="img-fluid icon1"
                      /></b-button>
                      <b-modal
                        ref="uploadCsv"
                        id="uploadCsv"
                        centered
                        :title="$t('UploadIcon')"
                        hide-footer
                        no-close-on-backdrop
                      >
                        <p class="my-4">
                          <input
                            type="file"
                            id="csv-file"
                            @change="updateFileName"
                            accept=".csv"
                          />
                        </p>
                        <div class="text-right d-flex justify-content-end">
                          <b-button
                            class="mt-2 blue-btn w-25"
                            block
                            @click="readFile()"
                            >{{ $t("submitbtn") }}</b-button
                          >
                        </div>
                      </b-modal>
                    </div>
                  </div>
                  <div class="row mx-0">
                    <div class="col px-1">
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
                        :fields="fields"
                        :items="filteredTranslationArray"
                        show-empty
                      >
                        <template #cell()="data">
                          <span v-html="data.value"></span>
                        </template>
                        <template #cell(action)="data">
                          <!-- <i
                          class="fa fa-edit cursor-pointer"
                          v-b-tooltip.hover
                          :title="$t('edit')"
                          @click="editTranslation(data)"
                        ></i> -->
                          <img
                            :src="
                              require('@/assets/images/icons/editActive.svg')
                            "
                            class="img-fluid w-24 cursor-pointer mx-3 edit-img"
                            v-b-tooltip.hover
                            :title="$t('edit')"
                            @click="editTranslation(data)"
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
                  </div>
                </div>
                <div class="col-5 pr-0">
                  <div style="min-height: 455px">
                    <template v-if="editObj">
                      <h5 class="mb-4">
                        {{ $t("editTranslation") }}
                      </h5>
                      <div class="mb-4 small">
                        <strong>{{ $t("note") }}:&nbsp;</strong
                        >{{ $t("transNote") }}
                      </div>
                      <div v-for="(l, i) in langSequence" :key="'lang' + i">
                        <div class="pb-3">
                          <label for="translation-lang1">{{
                            $t(`${l}`)
                          }}</label>
                          <template v-if="!isLangValid[i]">
                            <br />
                            <span class="small py-2 text-danger"
                              ><strong
                                >{{ $t("errorHead") }}&nbsp;{{
                                  $t("transError")
                                }}</strong
                              ></span
                            >
                          </template>
                          <b-form-textarea
                            id="translation-lang1"
                            size="sm"
                            placeholder=""
                            v-model="editObj[l]"
                          ></b-form-textarea>
                          <div class="small pt-2" v-if="isLangChange[i]">
                            <div class="pb-2 small">{{ $t("ognlText") }}</div>
                            <i
                              class="fa fa-undo mr-3 cursor-pointer"
                              @click="editObj[l] = editOriginalObj[l]"
                              :title="$t('revert')"
                              v-b-tooltip.hover
                            ></i>
                            {{ editOriginalObj[l] }}
                            <div class="py-2 small">{{ $t("var") }}</div>
                            <template v-if="langVar[l] && langVar[l].length">
                              <h6 class="d-inline-block mb-0">
                                <b-badge
                                  variant="secondary"
                                  class="m-1 shadow-sm selection-pills"
                                  v-for="(o, i) in langVar[l]"
                                  :key="i"
                                  >{{ "{" + o + "}" }}</b-badge
                                >
                              </h6>
                            </template>
                            <template v-else>
                              <div class="small">{{ $t("noVar") }}</div>
                            </template>
                          </div>
                        </div>
                      </div>
                    </template>
                    <div
                      class="h-100 d-flex justify-content-center align-items-center"
                      v-else
                    >
                      <i class="fa fa-long-arrow-left fa-2x me-3"></i
                      >{{ $t("selectTranslation") }}
                    </div>
                  </div>
                  <div class="text-right mt-3" style="bottom: 0; right: 0">
                    <button
                      type="button"
                      class="btn btn-primary cancel-btn1 black-btn mx-3"
                      @click.prevent.stop="cancelEdit"
                    >
                      {{ $t("cancelbtn") }}
                    </button>
                    <button
                      type="button"
                      class="btn btn-primary blue-btn ml-3"
                      @click.prevent.stop="saveEdit(null)"
                      :disabled="disableEdit"
                    >
                      {{ $t("save") }}
                    </button>
                  </div>
                </div>
              </div>
            </b-modal>
          </b-dropdown>
        </div>
        <!-- <div class="button-group">
          <b-dropdown
            size="lg"
            variant="link"
            toggle-class="text-decoration-none"
            no-caret
          >
            <template #button-content>
              <img src="../../assets/images/Icon material-language.svg" />
            </template>
            <b-dropdown-item href="#">English</b-dropdown-item>
            <b-dropdown-item href="#">French</b-dropdown-item>
          </b-dropdown>

          <img
            src="../../assets/images/Icon material-refresh.svg"
            class="mx-3"
          />
          <img
            src="../../assets/images/Icon ionic-ios-settings.svg"
            class="mx-3"
          />
        </div> -->
      </div>
    </div>
  </nav>
</template>

<script>
import LanguageChangeMixin from "@/helpers/LanguageChangeMixin";
import service from "@/service";
import get from "lodash/get";
import merge from "lodash/merge";
import JSZip from "jszip";
export default {
  name: "HeaderBar",
  mixins: [LanguageChangeMixin],
  props: ["langList"],
  components: {
    LanguageChange: () =>
      import(
        /*webpackChunkName: 'LanguageChange'*/ "@/components/Common/LanguageChange"
      ),
    UploadConfig: () =>
      import(
        /*webpackChunkName: 'UploadConfig'*/ "@/components/Common/UploadConfig"
      ),
  },
  data() {
    return {
      filterColor: "red",
      exportPopup: false,
      selectedModule: null,
      exportOptions: [],
      uploadConfig: false,
      fields: [],
      translationArray: [],
      translationObj: {},
      addTranslation: false,
      currentPage: 1,
      perPage: 100,
      rows: 0,
      langSequence: [],
      editOriginalObj: null,
      editObj: null,
      isLangValid: [],
      isLangChange: [],
      langVar: {},
      searchText: "",
      updateDOM: 0,
      tempFields: [],
      tempItems: [],
      templatesData: null,
      showTempModal: false,
      config: {
        delimiter: "",
        newline: "",
        quoteChar: '"',
        escapeChar: '"',
        header: true,
        dynamicTyping: true,
        preview: 0,
        encoding: "",
        delimitersToGuess: [",", "\t", "|", ";"],
      },
      availability: "",
      fileName: "",
      filter: null,
      totalRows: 1,
    };
  },
  computed: {
    profileInitials() {
      let p = "",
        u = this.$store.getters.getUserDetails;
      if (u) {
        p = u.firstName[0].toUpperCase() + u.surname[0].toUpperCase();
      }
      return p;
    },
    userName() {
      return this.$store.getters.getUserDetails
        ? `${this.$store.getters.getUserDetails.firstName} ${this.$store.getters.getUserDetails.surname}`
        : "";
    },
    tableName() {
      return this.$store.getters.getAppSettings.tableName;
    },
    filteredTranslationArray() {
      let filteredTranslations = this.translationArray.filter(
        (t) =>
          (t.en &&
            t.en.toLowerCase().includes(this.searchText.toLowerCase())) ||
          (t.fr && t.fr.toLowerCase().includes(this.searchText.toLowerCase()))
      );
      console.log(filteredTranslations, "filteredTranslations");
      return filteredTranslations;
    },
    disableEdit() {
      let isDisable = false;
      if (
        this.isLangChange.every((l) => !l) ||
        this.isLangValid.some((l) => !l)
      ) {
        isDisable = true;
      }

      return isDisable;
    },
  },
  watch: {
    filteredTranslationArray(newValue) {
      this.rows = newValue.length;
    },
    editObj: {
      handler: function (newValue) {
        if (newValue) {
          this.langSequence.forEach((l, i) => {
            let change = this.editOriginalObj[l] !== newValue[l];
            this.checkVariables(change, l, i);
          });
        }
      },
      deep: true,
    },
  },
  methods: {
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    executeTemplates(obj) {
      if (obj.type == "delete") {
        this.$swal({
          text: this.$i18n.t("noRetrive"),
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: this.$i18n.t("yesDel"),
        }).then((result) => {
          if (result.isConfirmed) {
            this.$refs["showTemplates"].hide();
            this.$emit("emitExecute", obj);
          }
        });
      } else {
        this.$refs["showTemplates"].hide();
        this.$emit("emitExecute", obj);
      }
    },
    viewTemplates() {
      this.$refs["showTemplates"].show();
      this.$store.commit("setLoading", true);

      this.getTemplatesData();
    },
    hideTemplates() {
      this.$refs["showTemplates"].hide();
    },
    getTemplatesData() {
      this.tempItems = [];
      let key = this.generateKey("savedTemplates");
      service
        .getSavedConfig({
          tableKey: key,
        })
        .then((resp) => {
          this.$store.commit("setLoading", false);

          this.templatesData = resp.data;
          this.tempFields = [
            // { key: "tempId", label: this.$i18n.t("id") },
            {
              key: "name",
              label: this.$i18n.t("name"),
            },
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
            {
              key: "delete",
              label: this.$i18n.t("delete"),
            },
          ];
          Object.keys(this.templatesData).forEach((keys) => {
            let rows = {};
            rows["tempId"] = this.templatesData[keys]["tempId"];
            rows["name"] = this.templatesData[keys]["tempName"];
            rows["createdOn"] = this.templatesData[keys]["createdOn"];
            rows["tempDetails"] = this.templatesData[keys]["tempDetails"];
            this.tempItems.push(rows);
          });
          this.totalRows = this.tempItems.length;

          this.tempItems.sort((a, b) => {
            // console.log(new Date(a["createdOn"]) , new Date(b["createdOn"]))
            return (
              new Date(b["createdOn"]) -
              new Date(a["createdOn"])
            );
          });
          console.log(this.tempItems)
        })
        .catch((err) => {
          this.$store.commit("setLoading", false);

          console.log("Templates not found");
        });
    },
    showUploadCsv() {
      this.$refs["uploadCsv"].show();
    },
    hideUploadCsv() {
      this.$refs["uploadCsv"].hide();
    },
    updateFileName() {
      this.fileName = event.target.files[0];
    },
    readFile() {
      this.$papa.parse(this.fileName, {
        header: true,
        skipEmptyLines: true,
        complete: this.onComplete,
      });
    },
    onComplete(results) {
      let translationArray = results.data;
      this.hideUploadCsv();
      this.saveEdit(translationArray);
    },
    checkVariables(newValue, lang, i) {
      this.$set(this.isLangChange, i, newValue);
      if (newValue) {
        let isValid = true;
        if (lang) {
          let oData = this.editOriginalObj[lang];
          let oFound = this.getVariables(oData);
          this.langVar[lang] = oFound;
          if (oFound.length) {
            let nData = this.editObj[lang];
            let nFound = this.getVariables(nData);
            if (nFound.length) {
              if (oFound.sort().join(",") === nFound.sort().join(",")) {
                isValid = true;
              } else {
                isValid = false;
              }
            } else {
              isValid = false;
            }
          }
        }
        this.$set(this.isLangValid, i, isValid);
      } else {
        this.$set(this.isLangValid, i, true);
        this.langVar[lang] = [];
      }
    },
    getVariables(data) {
      let found = [], // an array to collect the strings that are found
        rxp = /{([^}]+)}/g,
        curMatch;

      if (data) {
        while ((curMatch = rxp.exec(data))) {
          found.push(curMatch[1]);
        }
      }
      return found;
    },
    uploadConfigPopup() {
      this.uploadConfig = true;
    },
    uploadSuccess() {
      this.uploadConfig = false;
    },
    generateTranslationArray(obj) {
      let lang = this.langSequence[0];
      Object.keys(obj[lang]).forEach((t) => {
        let transObj = {
          path: t,
          [lang]: obj[lang][t],
        };
        Object.keys(obj).forEach((t1) => {
          if (t1 !== lang) {
            transObj[[t1]] = get(obj[t1], t) || "";
          }
        });
        this.translationArray.push(transObj);
      });
    },
    async addTranslations() {
      this.$store.commit("setLoading", true);
      this.fields = [];
      this.translationArray = [];
      this.langSequence = [this.$i18n.locale];
      if (this.$store.getters.getAppSettings.languageSupport) {
        this.langList.forEach((l) => {
          if (l !== this.$i18n.locale) {
            this.langSequence.push(l);
          }
        });
      }
      let allTranslations = {};
      this.langSequence.forEach((l, i) => {
        this.fields.push({ key: l, label: this.$i18n.t(`${l}`) });
        if (i === this.langSequence.length - 1) {
          this.fields.push({
            key: "action",
            label: this.$i18n.t("action"),
          });
        }
      });
      let staticData = await import(`@/locale/translations.js`),
        mergedData = staticData.default || {},
        proceed = true;
      await service
        .getSavedConfig({ tableKey: "translations", isDefault: true })
        .then(async (results) => {
          mergedData = merge(staticData.default, results.data);
        })
        .catch((res) => {
          this.$store.commit("setLoading", false);
          if (!res.message.includes("404")) {
            proceed = false;
            this.sweetAlert({
              title: this.$i18n.t("error"),
              text: res,
            });
          }
        });
      if (proceed) {
        Object.keys(mergedData).forEach((l) => {
          allTranslations[l] = mergedData[l];
        });
        if (this.$store.getters.getAppSettings.languageSupport) {
          Object.keys(allTranslations).forEach((l) => {
            if (!this.langSequence.includes(l)) {
              this.langSequence.push(l);
              this.fields.splice(this.fields.length - 1, 0, {
                key: l,
                label: this.$i18n.t(`${l}`),
              });
            }
          });
        }
        this.generateTranslationArray(allTranslations);
        // this.translationArray = this.translationArray.filter(
        //   (t) => !t[this.$i18n.locale].includes("{")
        // );
        this.$nextTick(() => {
          this.$store.commit("setLoading", false);
          this.addTranslation = true;
        });
      }
    },
    editTranslation(data) {
      this.editOriginalObj = JSON.parse(JSON.stringify(data.item));
      this.editObj = JSON.parse(JSON.stringify(data.item));
    },
    saveEdit(translationArray = null) {
      this.$store.commit("setLoading", true);
      let updatedData = [];
      if (translationArray) {
        this.translationArray.forEach((t) => {
          let isFound = translationArray.find((ut) => ut.path === t.path);
          if (isFound) {
            let obj = {
              path: t.path,
            };
            this.langSequence.forEach((l) => {
              if (t[l] !== isFound[l]) {
                obj[l] = isFound[l];
              }
            });
            if (Object.keys(obj).length > 1) {
              updatedData.push(obj);
            }
          }
        });
      }
      service
        .getSavedConfig({ tableKey: "translations", isDefault: true })
        .then((results) => {
          let data = results.data;
          if (translationArray) {
            updatedData.forEach((d) => {
              let dKeys = Object.keys(d);
              this.langSequence.forEach((l) => {
                if (dKeys.includes(l) && !data[l]) {
                  data[l] = {};
                }
                if (dKeys.includes(l)) {
                  data[l][d.path] = d[l] || "";
                }
              });
            });
          } else {
            this.langSequence.forEach((l, i) => {
              if (this.isLangChange[i]) {
                if (!data[l]) {
                  data[l] = {};
                }
                data[l][this.editObj.path] = this.editObj[l] || "";
              }
            });
          }
          service
            .updateConfig({
              data: data,
              tableKey: "translations",
              isDefault: true,
            })
            .then((res) => {
              this.$store.commit("setLoading", false);
              this.$swal({
                title: this.$i18n.t("data_saved_successfully"),
                confirmButtonText: this.$i18n.t("ok"),
              }).then((result) => {
                if (result.value) {
                  this.addTranslations();
                  this.cancelEdit();
                }
              });
            })
            .catch((res) => {
              this.$store.commit("setLoading", false);
              this.sweetAlert({
                title: this.$i18n.t("error"),
                text: res,
              });
            });
        })
        .catch(() => {
          let data = {};
          if (translationArray) {
            updatedData.forEach((d) => {
              let dKeys = Object.keys(d);
              this.langSequence.forEach((l) => {
                if (dKeys.includes(l) && !data[l]) {
                  data[l] = {};
                }
                if (dKeys.includes(l)) {
                  data[l][d.path] = d[l] || "";
                }
              });
            });
          } else {
            this.langSequence.forEach((l, i) => {
              if (this.isLangChange[i]) {
                if (!data[l]) {
                  data[l] = {};
                }
                data[l][this.editObj.path] = this.editObj[l] || "";
              }
            });
          }
          service
            .saveConfig({
              data: data,
              tableKey: "translations",
              isDefault: true,
            })
            .then((res) => {
              this.$store.commit("setLoading", false);
              this.$swal({
                title: this.$i18n.t("data_saved_successfully"),
                confirmButtonText: this.$i18n.t("ok"),
              }).then((result) => {
                if (result.value) {
                  this.addTranslations();
                  this.cancelEdit();
                }
              });
            })
            .catch((res) => {
              this.$store.commit("setLoading", false);
              this.sweetAlert({
                title: this.$i18n.t("error"),
                text: res,
              });
            });
        });
    },
    cancelEdit() {
      this.editOriginalObj = null;
      this.editObj = null;
      this.isLangChange = [];
      this.isLangValid = [];
      this.langVar = {};
    },
    downloadConfig() {
      this.$store.commit("setLoading", true);
      service.getAllKeys({}).then(async (res) => {
        let zip = new JSZip();
        for (const file of res.data) {
          const contents = await service.getSavedConfig({ tableKey: file });

          zip.file(`${file}.json`, JSON.stringify(contents.data));
        }
        zip.generateAsync({ type: "blob" }).then((content) => {
          saveAs(
            content,
            `${this.$store.getters.getNamespace}_${this.$moment().format(
              "lll"
            )}.zip`
          );
          this.$store.commit("setLoading", false);
          this.sweetAlert({
            title: this.$i18n.t("success"),
            text: this.$i18n.t("backupDatastoreSuccess"),
          });
        });
      });
    },
    clearCache() {
      this.$store.commit("setLoading", true);
      this.$store.commit("setStoreValues");
      this.$store.commit("setIsClearCache", true);
      location.reload(true);
      this.$store.commit("setLoading", false);
    },
  },
  created() {
    //this.getTemplatesData();
  },
};
</script>
<style scoped lang="scss">
.profilebox-upper-left {
  display: inline-block;
  vertical-align: top;
  width: 50px;
  font-size: 20px;
  padding: 10px 12px;
  height: 50px;
  background: var(--main-color);
  border-radius: 50%;
}
.border-bottom-header {
  border-bottom: 1px solid var(--border-color);
}
.b-table-sticky-header {
  max-height: 400px;
}
.b-transparent,
.b-transparent:hover,
.b-transparent:focus,
.b-transparent:active {
  background: transparent !important;
  background-color: transparent !important;
}
.border-transparent,
.border-transparent:hover,
.border-transparent:focus,
.border-transparent:active {
  border: 0px;
  border-color: transparent;
}
</style>
