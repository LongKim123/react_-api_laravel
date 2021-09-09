<template>
  <modal
    :title="title"
    enter-animation="zoomIn"
    leave-animation="zoomOut"
    animation-duration="medium"
    leave-animation-duration="fast"
    @close="handleClose"
  >
    <div
      slot="body"
      class="bodyDiv"
    >
      <div
        v-if="showLandingWarning"
        class="container"
      >
        <div class="update-warning-wrapper">
          <div class="display-inline-block">
            <icon
              name="warning_outline"
              :width="32"
              :height="32"
            />
          </div>
          <h2
            class="display-inline-block ml-2"
            style="vertical-align: middle"
          >
            Please note
          </h2>

          <div class="warning-content">
            <span>Changing or adding new positions for your employees may require you to issue a new contract.</span>
          </div>

          <div class="warning-content">
            <span>You will also need to
              <span v-if="isMainPermanentPartTimePosition">
                set a new <strong>Work Pattern</strong> and</span> review any outstanding
              <strong>Timesheets</strong> or <strong>Rostered Shifts</strong>.
            </span>
          </div>

          <div
            v-if="showEmploymentTypeSelection"
            class="employment-type-change-wrapper"
          >
            <label>Employment Type</label>
            <button
              class="btn"
              :class="employmentType === 'full' ? 'btn-primary' : 'btn-inverse'"
              @click="handleEmploymentType('full')"
            >
              Full Time
            </button>
            <button
              class="btn"
              :class="employmentType === 'part' ? 'btn-primary' : 'btn-inverse'"
              @click="handleEmploymentType('part')"
            >
              Part Time
            </button>
            <button
              class="btn"
              :class="employmentType === 'casual' ? 'btn-primary' : 'btn-inverse'"
              @click="handleEmploymentType('casual')"
            >
              Casual
            </button>
          </div>

          <div class="update-warning-btn-wrapper">
            <button
              class="btn btn-primary round-modal-large-button"
              @click="handleShowLandingWarning"
            >
              Continue
            </button>
            <a
              class="btn btn-underline"
              @click="handleClose"
            >
              Cancel & Exit
            </a>
            <div
              v-if="editMode"
              class="display-inline-block"
            >
              <input
                id="dont-show-me-this-message"
                v-model="dontShowMeThisMessage"
                class="noStyle"
                type="checkbox"
              >
              <label for="dont-show-me-this-message">
                Don't show me this message again
              </label>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!showLandingWarning">
        <fu-steps
          :steps="steps"
          :index="stepIndex"
          :step-click-callback="handleStepClick"
        />
        <div class="employment-position-update-wrapper">
          <update-permanent-part-time-position-form
            v-if="showPPTForm"
            @close="handleClose"
          />

          <update-casual-position-form
            v-if="showCasualForm"
            @close="handleClose"
          />

          <work-pattern-form
            v-if="showWorkPatternForm"
            @close="handleClose"
          />

          <cashout-entitlements-form
            v-if="showCashoutEntitlementForm"
            @close="handleClose"
          />

          <review-and-schedule
            v-if="showReviews"
            @close="handleClose"
          />

          <AddEntitlementsConfirmationComponent
            v-if="showAddEntitlementConfirmation"
            @close="handleClose"
          />
        </div>
      </div>
      <br>
    </div>
  </modal>
</template>

<script>
  import { mapActions, mapState, mapGetters } from 'vuex';
  import Modal from '../../../UI/FuModal';
  import FuSteps from '../../../forms/FuSteps';
  import UpdatePermanentPartTimePositionForm from './UpdatePermanentPartTimeEmployeePositionForm';
  import UpdateCasualPositionForm from './UpdateCasualEmployeePositionForm';
  import WorkPatternForm from './WorkPatternForm';
  import ReviewAndSchedule from './ReviewAndSchedule';
  import Icon from '../../../Icon';
  import CashoutEntitlementsForm from './Entitlement/CashoutEntitlementsForm';
  import AddEntitlementsConfirmationComponent from './Entitlement/AddEntitlementsConfirmationComponent';

  import {
    saveFuSettingsLocalStorage,
    getFuSettingsLocalStorage,
  } from '../../../../../lib/local-storage-helper';

  export default {

    components: {
      modal: Modal,
      'fu-steps': FuSteps,
      'update-permanent-part-time-position-form': UpdatePermanentPartTimePositionForm,
      'update-casual-position-form': UpdateCasualPositionForm,
      'work-pattern-form': WorkPatternForm,
      'review-and-schedule': ReviewAndSchedule,
      'cashout-entitlements-form': CashoutEntitlementsForm,
      icon: Icon,
      AddEntitlementsConfirmationComponent,
    },

    data() {
      return {
        title: 'Update Positions & Employment Type',
        showLandingWarning: true,
        dontShowMeThisMessage: false,
      };
    },

    computed: {

      steps() {
        let steps = [];
        // casual or secondary position
        if (!this.isMainPermanentPartTimePosition || this.employmentType === 'casual') {
          steps = ['Position Details', 'Review Schedule'];
        } else {
          steps = ['Position Details', 'Work Pattern', 'Review Schedule'];
        }

        if (
          this.entitlementsToCashOut.length
          && (this.isCreatingFirstCasualPosition || this.isCreatingFirstPPTPosition)
        ) {
          steps.splice(steps.length - 1, 0, 'Entitlements');
        }

        if ((this.isCreatingFirstCasualPosition || this.isCreatingFirstPPTPosition) && !this.employeeEntitlement.length) {
          steps.push('Add Entitlements');
        }

        return steps;
      },

      showEmploymentTypeSelection() {
        return !this.editMode && (this.employmentType === 'casual' || this.isMainPermanentPartTimePosition);
      },

      showPPTForm() {
        return this.isMainPermanentPartTimePosition && this.stepIndex === 0;
      },

      showCasualForm() {
        return (this.employmentType === 'casual' || !this.isMainPermanentPartTimePosition) && this.stepIndex === 0;
      },

      showWorkPatternForm() {
        return ['full', 'part'].includes(this.employmentType) && this.isMainPermanentPartTimePosition && this.stepIndex === 1;
      },

      showCashoutEntitlementForm() {
        if (this.entitlementsToCashOut.length) {
          if (this.isCreatingFirstCasualPosition && this.stepIndex === 1) {
            return true;
          }
          if (this.isCreatingFirstPPTPosition && this.stepIndex === 2) {
            return true;
          }
        }
        return false;
      },

      showReviews() {
        if ((this.isCreatingFirstCasualPosition || this.isCreatingFirstPPTPosition) && !this.employeeEntitlement.length) {
          return this.steps.length - 2 === this.stepIndex;
        }
        return this.steps.length - 1 === this.stepIndex; // last step
      },

      showAddEntitlementConfirmation() {
        // first position and no any entitlements set
        return (
          (this.isCreatingFirstCasualPosition || this.isCreatingFirstPPTPosition)
          && this.stepIndex === this.steps.length - 1
          && !this.employeeEntitlement.length
        );
      },

      ...mapState('EmploymentType', [
        'employmentType',
        'editMode',
        'stepIndex',
        'selectedPositionData',
        'isMainPermanentPartTimePosition',
        'employeeEntitlement',
        'initialEmploymentType',
      ]),

      ...mapGetters('EmploymentType', [
        'currentPermanentPartTimePosition',
        'entitlementsToCashOut',
        'payableEntitlements',
        'isCreatingFirstPPTPosition',
        'isCreatingFirstCasualPosition',
      ]),
    },

    watch: {
      dontShowMeThisMessage: {
        handler(val) {
          saveFuSettingsLocalStorage('dontShowMeThisMessage', val);
        },
      },
    },

    beforeMount() {
      if (this.editMode) {
        this.getPositionLastProcessedPaycycle();
      }
    },

    mounted() {
      this.showLandingWarning = this.editMode ? !getFuSettingsLocalStorage('dontShowMeThisMessage', false) : true;
      if (this.employmentType !== 'casual' && this.isMainPermanentPartTimePosition && this.editMode) {
        this.setEmployeeWorkPatternData(this.selectedPositionData?.relationships?.permanentPartTimePosition?.relationships?.autopay || null);
        this.setWorkPatternParams({});
      }

      let titleLabel = 'Position';

      if (!this.isMainPermanentPartTimePosition && this.employmentType !== 'casual') {
        titleLabel = 'Additional Position';
        this.showLandingWarning = false;
      }

      this.title = `${this.editMode ? 'Update' : 'Create New'} ${titleLabel}`;
    },

    destroyed() {
      this.setSelectedPosition(null); // reset
      this.setLastProcessedPaycycle(null); // reset
      this.setEditPositionMode(false); // reset
      this.setFormStepIndex(0);
      this.setPositionParams({});
      this.setDisableSaveBtn(false);
      this.setWorkPatternParams({});
      this.setClientStatementCycle(1);
      this.setClientFirstStatementWeekEnd(null);
      this.setEmployeeWorkPatternData(null);
      this.setEmploymentType(this.initialEmploymentType);
      this.setEntitlementsParams({});
    },

    methods: {
      handleClose() {
        this.$emit('close');
      },

      handleShowLandingWarning() {
        this.showLandingWarning = false;
      },

      handleStepClick(e, index) {
        if (this.stepIndex >= index) {
          this.setFormStepIndex(index);
        }
      },

      handleEmploymentType(type) {
        if (['full', 'part'].includes(type)) {
          this.setPermanentPartTimePositionType(true);
        } else {
          this.setPermanentPartTimePositionType(false);
        }
        this.setEmploymentType(type);
      },

      ...mapActions('EmploymentType', [
        'setEmploymentType',
        'setPermanentPartTimePositionType',
        'setFormStepIndex',
        'getPositionLastProcessedPaycycle',
        'setSelectedPosition',
        'setLastProcessedPaycycle',
        'setEditPositionMode',
        'setFormStepIndex',
        'setPositionParams',
        'setDisableSaveBtn',
        'setWorkPatternParams',
        'setClientStatementCycle',
        'setClientFirstStatementWeekEnd',
        'setEmploymentType',
        'setEmployeeWorkPatternData',
        'setEntitlementsParams',
      ]),
    },
  };
</script>
