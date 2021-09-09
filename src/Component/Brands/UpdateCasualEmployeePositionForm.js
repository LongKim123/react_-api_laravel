<template>
  <div>
    <div class="display-flex flex-direction-row flex-fill">
      <div class="fu-form fu-form-thin fu-form-light-border">
        <div class="employment-position-update-form-section">
          <label>Locations</label>
          <LocationSelector
            :multi="true"
            :classes="form.errors.has('positions.0.locations') ? `no-max-width border-error` : `no-max-width` "
            :clear-location="!form.locations.length"
            :pre-selected-locations="preSelectedLocations"
            @change="handleLocationChange"
          />
          <span
            v-if="form.errors.has('positions.0.locations')"
            class="text-error"
          >Required</span>
        </div>
        <div
          v-if="!editMode"
          class="employment-position-update-form-section"
        >
          <label>Position Group (optional)</label>
          <PositionGroupSelector
            classes="no-max-width"
            :multi="true"
            :clear="!selectedPositionGroups.length"
            @change="handlePositionGroupChange"
          />
          <div>
            <input
              id="position-group-checkbox"
              v-model="applyAllPositions"
              class="noStyle"
              type="checkbox"
              :disabled="!selectedPositionGroups.length"
            >
            <label for="position-group-checkbox">Add every position in selected groups</label>
          </div>
        </div>
        <div
          v-show="!applyAllPositions"
          class="employment-position-update-form-section"
        >
          <label>Position</label>
          <PositionSelector
            :classes="form.errors.has('positions.0.position_id') ? `no-max-width border-error` : `no-max-width`"
            :pre-selected-positions="[preSelectedPosition]"
            :locations="form.locations"
            :position-groups="selectedPositionGroups"
            :clear="!form.position_id"
            :skip-positions="skipPositions"
            @change="handlePositionChange"
            @allPositions="handleGetAllPositions"
            @isPositionLoading="handleIsPositionLoading"
          />
          <span
            v-if="form.errors.has('positions.0.position_id')"
            class="text-error"
          >Required</span>
        </div>
        <div
          v-show="!applyAllPositions"
          class="employment-position-update-form-section"
        >
          <label>Custom Position Title (optional)</label>
          <input
            v-model="form.custom_position_title"
            type="text"
            class="no-max-width"
          >
        </div>
        <div
          v-show="!applyAllPositions"
          class="employment-position-update-form-section"
        >
          <div
            v-if="employmentType !== 'casual'"
            class="switch display-inline-block"
          >
            <label :class="{'cursor-not-allowed': false}">
              Use Operation rates book
              <input type="hidden">
              <input
                v-model="form.use_operation_rates_book"
                type="checkbox"
                class="noStyle"
                :disabled="!form.rate"
              >
              <span class="lever" />
            </label>
          </div>

          <label>Rate</label>
          <div
            v-if="!form.use_operation_rates_book"
            class="dollar-input-wrapper display-inline-block"
            :class="{'border-error': form.errors.has('positions.0.rate') || !isValidFormRate}"
          >
            <span>$</span>
            <input
              v-model="form.rate"
              type="number"
              min="1"
              step="0.01"
              :disabled="isNoPayAward"
              @keydown="form.errors.clear('positions.0.rate')"
            >
          </div>
          <div
            v-else
            class="employment-position-update-form-section"
          >
            <span>
              <v-icon
                name="info_fill"
                :width="18"
                :height="18"
                class="text-primary display-inline-block vertical-align-middle"
              />
              Pay rate calculated using the operation rates book associated with the roster or job
            </span>
          </div>
          <div v-if="form.errors.has('positions.0.rate')">
            <span class="text-error">Required</span>
          </div>
          <div
            v-if="!isValidFormRate"
            class="text-error"
          >
            {{ 'Rate must be greater than or equal to $'+baseRate }}
          </div>
        </div>
        <div v-if="!applyAllPositions">
          <PositionCostCodeComponent
            :default-setting="false"
            :selected-position-data="form"
            :validation-errors="form.errors"
            :clear="!form.cost_code"
            @costCodeSetting="setCostCodeSetting"
            @costCode="setCostCode"
            @costCodeType="setCostCodeType"
          />
        </div>
        <div class="employment-position-update-form-section">
          <h4 v-if="!editMode">
            When will this position change take affect?
          </h4>
          <div class="display-inline-block">
            <label>Position Start Date</label>
            <div>
              <DatePicker
                :default-date="form.start_date"
                :disabled-dates="disabledDates"
                @change="handleStartDateChange"
              />
            </div>
          </div>
          <div class="display-inline-block">
            <label>Position End Date (optional)</label>
            <div>
              <DatePicker
                :default-date="form.end_date"
                :disabled-dates="thisDisabledEndDates"
                :clear-button="true"
                @change="handleEndDateChange"
              />
            </div>
          </div>
          <div v-if="form.errors.has('positions.0.start_date')">
            <span class="text-error">Required</span>
          </div>
          <span
            v-if="validationErrors"
            class="text-error"
          >
            {{ validationErrors }}
          </span>
        </div>
      </div>
    </div>
    <div
      v-if="!editMode"
      class="employment-position-update-form-section"
    >
      <div class="employment-position-update-form-section">
        <button
          class="btn btn-inverse border-brand"
          :disabled="isAddPositionBtnDisabled"
          @click="handleAddMorePosition"
        >
          <Icon
            name="circle_plus"
            :height="16"
            :width="16"
            class="display-inline-block"
          />
          {{ buttonLoadingLabel }}
        </button>
      </div>
    </div><CasualPositionReviewComponent
      v-if="positionsToSubmit.length"
      class="employment-position-update-form-section"
      :positions-to-submit="positionsToSubmit"
      :disable-dates="disabledDates"
      :disabled-end-dates="thisDisabledEndDates"
     @setPositionsToSubmit="setPositionsToSubmit"
    />

    <div class="display-flex flex-direction-row flex-fill">
      <button
        class="btn btn-primary round-modal-large-button"
        :disabled="disableSaveBtn || isBtnDisabled"
        @click="handleSave"
      >
        Continue
      </button>
      <a
        class="btn btn-underline"
        @click="handleClose"
      >Cancel & Exit</a>
    </div>
  </div>
</template>
<script>
  import { mapActions, mapState, mapGetters } from 'vuex';
  import moment from 'moment';
  import DatePicker from '../../../DatePicker';
  import PositionSelector from '../../../PositionSelector';
  import PositionGroupSelector from '../../../PositionGroupSelector';
  import LocationSelector from '../../../LocationSelector';
  import Icon from '../../../Icon';
  import PositionCostCodeComponent from './PositionCostCodeComponent';
  import CasualPositionReviewComponent from './CasualPositionReviewComponent';
  import FormHelper from '../../../../../lib/form-helper';
  import AuthCheck from '../../../../../lib/redirect-noauth';

  export default {

    components: {
      PositionSelector,
      LocationSelector,
      PositionGroupSelector,
      DatePicker,
      Icon,
      PositionCostCodeComponent,
      CasualPositionReviewComponent,
    },

    data() {
      return {
        oldLocationsHolder: [],
        preSelectedLocations: [],
        preSelectedPosition: null,
        selectedPositionGroups: [],
        selectedLocationsData: [],
        selectedPositionIdData: null,
        allPositions: [],
        baseRate: 0,
        positionsToSubmit: [],
        validationErrors: '',
        applyAllPositions: false,
        isPositionLoading: false,
        weekStartDate: null,

        form: new FormHelper({
          employee_id: null,
          position_id: null,
          position_label: null,
          custom_position_title: null,
          rate: 0,
          is_no_pay_award: false,
          locations: [],
          location_labels: null,
          start_date: null,
          end_date: null,
          selected_position_selection_id: null,
          employment_type: 'casual',
          cost_code_setting: false,
          cost_code: null,
          cost_code_type: null,
          create_new_position_record_with_changed_location: false,
          ending_position_without_start_date: false,
          use_operation_rates_book: false,
        }),
      };
    },

    computed: {

      isValidFormRate() {
        return this.$data.form.rate >= +this.$data.baseRate.toFixed(2);
      },

      skipPositions() {
        const ids = [];
        if (this.employmentType !== 'casual') {
          this.employeePermanentPartTimePositions.forEach((position) => {
            if (this.editMode) {
              if (position.attributes.subclass_id != this.selectedPositionData.attributes.subclass_id) {
                ids.push(position.attributes.subclass_id);
              }
            } else {
              ids.push(position.attributes.subclass_id);
            }
          });
        }

        return ids;
      },

      buttonLoadingLabel() {
        if (this.isPositionLoading) {
          return 'Loading Positions...';
        } if (this.allPositions.length) {
          return this.applyAllPositions ? 'Add & Review Positions' : 'Add & Review Position';
        }
        return 'No Available Positions';
      },

      thisDisabledEndDates() {
        const disabledEndDates = _.cloneDeep(this.disabledEndDates);
        if (this.form.start_date) {
          disabledEndDates.dates.push(moment(this.form.start_date).toDate());
          disabledEndDates.dates.push(moment(this.form.start_date).subtract(1, 'day').toDate());
          disabledEndDates.to = moment(this.form.start_date).toDate();

          if (this.lastProcessedPaycycle) {
            disabledEndDates.to = moment(this.lastProcessedPaycycle.end_date).toDate();
          }
        }
        return disabledEndDates;
      },

      isAddPositionBtnDisabled() {
        return (!this.allPositions.length || this.isPositionLoading);
      },

      isBtnDisabled() {
        if ((!this.positionsToSubmit.length && !this.editMode) || this.isPositionLoading) {
          return true;
        }
        return this.positionsToSubmit.find((position) => {
          let casualRate = position.casual_rate;
          if (this.employmentType !== 'casual') {
            casualRate = position.base_rate;
          }
          if (position.is_no_pay_award) {
            return position.rate === null;
          }
          return (!position.is_no_pay_award && (parseFloat(position.rate) < casualRate));
        });
      },

      isNoPayAward() {
        return !!(this.selectedPositionIdData?.is_no_pay_award);
      },

      editOrCreate() {
        // processed paycycle exist and rate / position is changed
        if (this.lastProcessedPaycycle && this.selectedPositionData) {
          // rate change
          if (this.selectedPositionData.attributes.rate != this.form.rate) {
            return 'create';
          }

          // position change
          if (this.selectedPositionData.attributes.subclass_id != this.form.position_id) {
            return 'create';
          }
        }

        return this.editMode ? 'edit' : 'create';
      },

      ...mapGetters('EmploymentType', [
        'disabledDates',
        'disabledEndDates',
        'selectedPositionLocationIds',
        'firstCasualPosition',
        'currentPermanentPartTimePosition',
      ]),

      ...mapState('EmploymentType', [
        'weekStartDay',
        'selectedPositionData',
        'employeeEntitlement',
        'employeeCasualPositions',
        'disableSaveBtn',
        'editMode',
        'employeeId',
        'employmentType',
        'initialEmploymentType',
        'positionParams',
        'pureCasualPositionSelectionsData',
        'lastProcessedPaycycle',
        'employeePermanentPartTimePositions',
      ]),
    },

    watch: {
      editOrCreate() {
        // reset position date
        if (this.editOrCreate === 'create' && this.editMode) {
          if (!(this.selectedPositionData.attributes.effective_start != this.form?.start_date)) {
            this.form.start_date = null;
          }
          this.form.end_date = null;
        } else if (this.editOrCreate === 'edit' && this.editMode && !this.form.start_date) {
          this.form.start_date = this.selectedPositionData?.attributes?.effective_start;
          this.form.end_date = this.selectedPositionData?.attributes?.effective_end;
        }
      },
    },

    beforeMount() {
      this.preSelectedLocations = this.selectedPositionLocationIds.locations;
      this.oldLocationsHolder = this.selectedPositionLocationIds.locations;

      if (this.positionParams?.params?.positions?.length > 0 && this.editMode) {
        this.form = new FormHelper(JSON.parse(JSON.stringify(this.positionParams.params.positions[0])));
      } else if (this.positionParams?.params?.positions?.length > 0) {
        this.positionsToSubmit = JSON.parse(JSON.stringify(this.positionParams.params.positions));
      } else if (this.editMode) {
        const position = this.selectedPositionData.attributes;
        this.form.employee_id = this.employeeId;
        this.form.position_id = position?.subclass_id;
        this.form.position_label = this.selectedPositionIdData?.label;
        this.form.custom_position_title = position?.custom_position_title;
        this.form.rate = position.rate;
        this.form.is_no_pay_award = this.isNoPayAward;
        // this.form.locations = [];
        // this.form.location_labels = null;
        this.form.start_date = position?.effective_start;
        this.form.end_date = position?.effective_end;
        this.form.selected_position_selection_id = this.selectedPositionData?.id;
        this.form.employment_type = 'casual';
        this.form.cost_code_setting = !!(position?.po && position?.po_type_id);
        this.form.cost_code = position?.po;
        this.form.cost_code_type = position?.po_type_id;
        this.form.use_operation_rates_book = position.use_operation_rates_book;
        // this.form.create_new_position_record_with_changed_location = false;
      } else {
        this.form.employee_id = this.employeeId;
      }

      if (this.form.position_id) {
        this.preSelectedPosition = this.form.position_id;
      }

      this.weekStartDate = moment().day(parseInt(this.weekStartDay, 10) - 1).format('YYYY-MM-DD');

      if (Object.keys(this.currentPermanentPartTimePosition).length) {
        if (this.currentPermanentPartTimePosition?.relationships?.permanentPartTimePosition?.relationships?.client?.attributes?.statement_cycle) {
          this.setClientStatementCycle(this.currentPermanentPartTimePosition.relationships.permanentPartTimePosition.relationships.client.attributes.statement_cycle);
        }

        if (this.currentPermanentPartTimePosition?.relationships?.permanentPartTimePosition?.relationships?.client?.attributes?.first_statement_week_end) {
          this.setClientFirstStatementWeekEnd(this.currentPermanentPartTimePosition.relationships.permanentPartTimePosition.relationships.client.attributes.first_statement_week_end);
        }
      }
    },

    methods: {
      handleClose() {
        this.$emit('close');
      },

      momentFormat(date) {
        return date ? moment(date).format('D MMMM YYYY') : 'Not Set';
      },

      setCostCodeSetting(val) {
        this.form.cost_code_setting = val.value;
      },

      setCostCode(val) {
        this.form.cost_code = val;
      },

      setCostCodeType(val) {
        this.form.cost_code_type = val;
      },

      setPositionsToSubmit(val) {
        this.positionsToSubmit = val;
      },

      handleLocationChange(val) {
        this.form.locations = val ? val.map((loc) => loc.id) : [];
        this.form.location_labels = val ? val.map((loc) => loc.label).join(', ') : '';
        this.selectedLocationsData = val;
        if (val) {
          this.form.errors.clear('positions.0.locations');
        }
      },

      handleIsPositionLoading(val) {
        this.isPositionLoading = val;
      },

      handlePositionChange(val) {
        if (val) {
          this.form.errors.clear('positions.0.position_id');
        }
        this.form.position_id = val?.id;
        this.form.position_label = val?.label;
        this.selectedPositionIdData = val;
        this.baseRate = val?.casual_rate; // casual base rate
        if (this.employmentType !== 'casual') {
          this.baseRate = val?.base_rate; // if is additional position use base rate
        }
        if (this.editMode && val && this.selectedPositionData.attributes.subclass_id == val.id) {
          if (this.positionParams?.params?.positions) {
            this.form.rate = this.positionParams.params.positions[0].rate;
          } else {
            this.form.rate = this.selectedPositionData.attributes.rate;
          }
          return;
        }

        if (this.positionParams?.params?.positions?.length === 1 && val && this.positionParams?.params?.positions[0]?.position_id == val.id) {
          this.form.rate = this.positionParams.params.positions[0].rate;
        } else {
          this.form.rate = this.baseRate;
        }
      },

      handleGetAllPositions(positions) {
        this.allPositions = positions;
      },

      handlePositionGroupChange(val) {
        this.selectedPositionGroups = _.map(val, 'id');
        if (!val) {
          this.applyAllPositions = false;
        }
      },

      handleStartDateChange(date) {
        this.form.start_date = date;
        if (this.form.end_date && this.form.end_date <= this.form.start_date) {
          this.form.end_date = null;
        }

        if (date) {
          this.form.errors.clear('positions.0.start_date');
        }
      },

      handleEndDateChange(date) {
        this.form.end_date = date;
      },

      handleAddMorePosition() {
        if (this.isAddPositionBtnDisabled) {
          return false;
        }

        this.form.employee_id = this.employeeId;
        this.form.is_no_pay_award = this.isNoPayAward;
        this.form.employment_type = this.employmentType;
        this.form.casual_rate = this.baseRate;

        if (this.allPositions?.length && this.applyAllPositions) {
          if (!this.form.start_date) {
            return false;
          }

          const allPositionIds = this.allPositions.map((positions) => positions.id);
          _.remove(this.positionsToSubmit, (position) => (allPositionIds.includes(position.position_id)));

          this.allPositions.forEach((position) => {
            this.positionsToSubmit.push({
              employee_id: this.employeeId,
              is_no_pay_award: position.is_no_pay_award,
              position_id: parseInt(position.id),
              position_label: position.position,
              position_short_title: position.short_title,
              rate: position.casual_rate,
              casual_rate: position.casual_rate,
              locations: this.form.locations,
              location_labels: this.selectedLocationsData.map((location) => location.label).join(', '),
              start_date: this.form.start_date,
              end_date: this.form.end_date,
              employment_type: this.employmentType,
              ending_position_without_start_date: false,
              use_operation_rates_book: false,
            });
          });

          this.handleReset();
        } else {
          if (!this.isNoPayAward && this.form.rate < this.baseRate) {
            return false;
          }
          const position = JSON.parse(JSON.stringify(this.form));
          this.validatePosition({ position_type: 'casual', payload: { positions: [position] } }).then((res) => {
            this.positionsToSubmit.push(position);
            this.handleReset();
          }).catch((err) => {
            AuthCheck(err);
            try {
              if (err.response.data.message === 'conflicting') {
                this.validationErrors = 'Conflicting with other positions';
              }
              this.form.errors.record(err.response.data.detail.original);
            } catch (err) {}
          });
        }
      },

      handleReset() {
        // reset
        this.selectedPositionGroups = [];
        this.selectedLocations = [];
        this.applyAllPositions = false;
        this.baseRate = 0;

        this.form = new FormHelper({
          employee_id: null,
          position_id: null,
          position_label: null,
          custom_position_title: null,
          rate: 0,
          is_no_pay_award: false,
          locations: [],
          location_labels: null,
          start_date: null,
          end_date: null,
          selected_position_selection_id: null,
          employment_type: 'casual',
          cost_code_setting: false,
          cost_code: null,
          cost_code_type: null,
          create_new_position_record_with_changed_location: false,
          ending_position_without_start_date: false,
          use_operation_rates_book: false,
        });

        // scroll
        setTimeout(() => {
          $('.round-modal-mask').stop().animate({
            scrollTop: 600,
          });
        }, 100);
      },

      handleSave() {
        this.validationErrors = null;
        this.setPositionParams({}); // reset

        this.form.employee_id = this.employeeId;
        this.form.is_no_pay_award = this.isNoPayAward;
        this.form.employment_type = this.employmentType;

        let paramsToSubmit = [];

        if (this.editOrCreate === 'edit') {
          this.form.selected_position_selection_id = this.selectedPositionData?.id;
          this.form.ending_position_without_start_date = !this.selectedPositionData.attributes.effective_start;
          paramsToSubmit = [this.form];
          console.log('edit');
        } else { // create
          this.form.selected_position_selection_id = null;
          paramsToSubmit = this.positionsToSubmit.length ? this.positionsToSubmit : [this.form];
          console.log('create');
        }
        this.validatePosition(
          {
            position_type: this.employmentType === 'casual' ? 'casual' : 'secondary',
            payload: { positions: paramsToSubmit },
          },
        ).then((res) => {
          this.setFormStepIndex(1);
          this.setPositionParams(
            {
              action: this.employmentType === 'casual' ? 'saveCasualPosition' : 'savePermanentPartTimeSecondaryPosition',
              params: { positions: paramsToSubmit },
            },
          );
        }).catch((err) => {
          AuthCheck(err);
          try {
            if (err.response.data.message === 'conflicting') {
              this.validationErrors = 'Conflicting with other positions';
            }
            this.form.errors.record(err.response.data.detail.original);
          } catch (err) {}
        });
      },

      ...mapActions('EmploymentType', [
        'saveCasualPosition',
        'setPositionParams',
        'setFormStepIndex',
        'validatePosition',
        'setClientStatementCycle',
        'setClientFirstStatementWeekEnd',
      ]),
    },
  };
</script>
