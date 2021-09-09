<template>
  <modal
    size="sm"
    class="approve-shift-modal"
    @close="handleClose"
  >
    <span
      slot="header"
      class="approve-shift-modal-header"
    >
      <div v-if="bulkModalType == 'approve'">
        <span>Approve Shifts</span>
        <v-icon
          name="tick_circle_filled"
          :width="30"
          :height="30"
          class="display-inline-block"
          style="padding-left: 20px;bottom: 5px;position: relative"
        />
      </div>
      <div v-else-if="bulkModalType == 'decline'">
        <span>Decline Shifts</span>
      </div>
      <div v-else-if="bulkModalType == 'adjustEndTime'">
        <span>Adjust End Times</span>
      </div>
    </span>
    <div slot="body">
      <div class="container-fluid">
        <div class="row">
          <div
            class="col-md-12"
            style="line-height: 2.2rem;padding-bottom: 10px;"
          >
            <div><strong>{{ selectedShiftsList[0].roster_branch_name }}</strong></div>
            <div class="d-flex align-items-baseline">
              <v-icon
                name="calendar"
                width="16px"
                height="16px"
                class="mr-2"
              /> {{
                momentFormat(selectedShiftsList[0].estimated_time.estimated_start,'dddd - DD/MM') }}
            </div>
          </div>
        </div>
        <div class="row bulk-action-info">
          <div class="col-md-6">
            <span>
              <strong style="color: #2C8FDD">{{ selectedShiftsList.length }}</strong> Shifts selected
            </span>
          </div>
          <div class="col-md-6">
            <span v-if="bulkModalType == 'approve'">
              <strong class="approve-active-label">{{ shiftsToApprove.length }}</strong>
              Shifts to be approved
            </span>
            <span v-if="bulkModalType == 'decline'">
              <strong class="cancel-active-label">{{ shiftsToDecline.length }}</strong>
              Shifts to be declined
            </span>
            <span v-if="bulkModalType == 'adjustEndTime'">
              <strong class="approve-active-label">{{ shiftsToAdjust.length }}</strong>
              Shifts to be adjusted
            </span>
          </div>
        </div>
        <div class="row bulk-action-extra-info">
          <div
            v-if="onLeave.length"
            class="col-md-12"
          >
            <span>
              <strong class="on-leave-label">{{ onLeave.length }}</strong>
              Shifts with leaves
            </span>
          </div>
          <div
            v-if="shiftsWithoutPosition.length"
            class="col-md-12"
          >
            <span>
              <strong class="cancel-active-label">{{ shiftsWithoutPosition.length }}</strong>
              Shifts with unassigned position
            </span>
          </div>
          <div
            v-if="shiftsWithErrors.length"
            class="col-md-12"
          >
            <span>
              <strong class="cancel-active-label">{{ shiftsWithErrors.length }}</strong>
              Shifts with errors
            </span>
            <hr>
          </div>
        </div>
        <div class="row bulk-action-extra-info">
          <div
            v-if="holidaysArray.length && bulkModalType == 'approve'"
            class="col-md-12"
          >
            <strong>{{ holidaysArray[0].description +' (' + holidaysArray[0].state + ')' }}</strong>
            <p>
              You are approving shifts on a <span class="text-bold">Public Holiday (P/H)</span>. Please
              select one of the following options:
            </p>
            <p v-if="casualShiftsToApprove.length">
              Shifts for casual employees will not be affected by this
              selection.
            </p>
            <div>
              <div>
                <div @click="(e) => handleHolidayRateToggle(e, null)">
                  <input
                    type="checkbox"
                    class="noStyle"
                    :value="holidayRate"
                    :checked="holidayRate === null"
                  >
                  <label class="list-label tooltip">Default
                    <span class="tooltipText">Public holiday rates will apply as per the award interpretation.</span>
                  </label>
                </div>
              </div>

              <div v-if="showMoreRateOptions">
                <div @click="(e) => handleHolidayRateToggle(e, 1)">
                  <input
                    type="checkbox"
                    class="noStyle"
                    :value="holidayRate"
                    :checked="holidayRate === 1"
                  >
                  <label class="list-label tooltip">Force public holiday entire shift
                    <span class="tooltipText">The shift will be paid as a public holiday regardless of the award interpretation.</span>
                  </label>
                </div>
              </div>

              <div>
                <div @click="(e) => handleHolidayRateToggle(e, 0)">
                  <input
                    type="checkbox"
                    class="noStyle"
                    :value="holidayRate"
                    :checked="holidayRate === 0"
                  >
                  <label class="list-label tooltip">Treat as normal day
                    <span class="tooltipText">The day will not be treated as a public holiday, standard rules will apply.</span>
                  </label>
                </div>
              </div>

              <div v-if="showMoreRateOptions">
                <div @click="(e) => handleHolidayRateToggle(e, 2)">
                  <input
                    type="checkbox"
                    class="noStyle"
                    :value="holidayRate"
                    :checked="holidayRate === 2"
                  >
                  <label class="list-label tooltip">Pay Base Rate
                    <span class="tooltipText">The employee's normal ordinary rate will be used and no overtime and shift loadings will be applied.</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="bulkModalType == 'adjustEndTime'"
            class="col-md-12"
          >
            <label class="form-label">Adjust End Time</label>
            <div class="input-wrapper">
              <text-duration-time-picker
                time="0m"
                @duration::change="handleAdjustEndChange"
              />
            </div>
            <div>
              <label
                style="display: inline-block !important; margin-right: 10px; cursor: pointer"
                @click="handleAdjustEndTimeTypeToggle('1')"
              >
                <input
                  v-model="adjustEndTimeType"
                  type="radio"
                  value="1"
                > Increase Time
              </label>
              <label
                style="display: inline-block !important; margin-right: 10px; cursor: pointer"
                @click="handleAdjustEndTimeTypeToggle('0')"
              >
                <input
                  v-model="adjustEndTimeType"
                  type="radio"
                  value="0"
                > Decrease Time
              </label>
            </div>
          </div>
          <div
            v-if="isProvideLeaveRule && bulkModalType == 'decline'"
            class="col-md-12"
          >
            <label>Reason</label>
            <div class="input-wrapper">
              <reason-list-selector @selectedReason="handleReason" />
            </div>
            <label>Comment</label>
            <div class="input-wrapper">
              <textarea
                v-model="comment"
                class="form-control"
                rows="2"
              />
            </div>
          </div>
        </div>
        <div
          class="row"
          style="padding-top: 20px;"
        >
          <div class="col-md-12">
            <span
              class="btn text-underline"
              @click="handleClose"
            >
              Cancel
            </span>
            <button
              v-if="bulkModalType == 'approve'"
              class="btn btn-outline-success approve-btn"
              :disabled="!shiftsToApprove.length || isDisabled"
              @click="(e) => handleApprove(e)"
            >
              {{ 'Approve ' +shiftsToApprove.length + ' Shifts' }}
            </button>
            <button
              v-if="bulkModalType == 'decline'"
              class="btn btn-outline-danger cancel-btn"
              :disabled="!shiftsToDecline.length || isDisabled"
              @click="(e) => handleDecline(e)"
            >
              {{ 'Decline ' +shiftsToDecline.length + ' Shifts' }}
            </button>
            <button
              v-if="bulkModalType == 'adjustEndTime'"
              class="btn btn-outline-primary edit-btn"
              :disabled="!shiftsToAdjust.length || isDisabled || !adjustedNewEndTime"
              @click="(e) => handleAdjustEndTimeSave(e)"
            >
              {{ 'Adjust ' +shiftsToAdjust.length + ' Shifts' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer" />
  </modal>
</template>

<script>
  import { mapState, mapActions, mapGetters } from 'vuex';
  import axios from 'axios';
  import _ from 'lodash';
  import moment from 'moment';
  import Modal from '../components/roster/RosterModal.vue';
  import TextDurationTimePicker from '../components/TextDurationTimePicker';
  import helpers from '../../lib/helperClasses/momentHelper.js';
  import LeaveTypeSelector from '../components/LeaveTypeSelector.vue';
  import ReasonListSelector from '../components/ReasonListSelector.vue';
  import { RosterShiftCandidatesVerifications } from '../../Constants/RosterShiftCandidates';

  export default {
    data() {
      return {
        approveShiftIcon: 'approve_shift',
        leaveTypeCasual: null,
        leaveTypeFull: null,
        reason: null,
        comment: null,
        declineError: '',
        holidayRate: null,
        shiftsHoliday: [],
        holidaysArray: [],
        adjustedNewEndTime: '',
        adjustEndTimeType: '1',
      };
    },

    mounted() {
      this.getShiftsWithHoliday();
    },

    computed: {
      casualShiftsToApprove() {
        return _.filter(this.shiftsToApprove, (selectedShiftsList) => (
          selectedShiftsList.employee_type === 'casual'
        ));
      },

      shiftsToApprove() {
        return _.filter(this.selectedShiftsList, (selectedShiftsList) => {
          const currentTime = moment().format('YYYY-MM-DD HH:mm:00');
          const isPreApproved = currentTime < selectedShiftsList?.estimated_time?.estimated_end && !this.getSetting('enable-pre-approve-shifts');
          return [
            RosterShiftCandidatesVerifications.NOT_YET_VERIFIED,
            RosterShiftCandidatesVerifications.CANDIDATE_SUBMITTED,
            null,
          ].indexOf(selectedShiftsList.verification) > -1
            && (selectedShiftsList.position.position_id || selectedShiftsList.position_group.position_group_id)
            && !Object.keys(_.filter(selectedShiftsList.errors, (error) => error.severity === 'error')).length && !isPreApproved;
        });
      },

      shiftsToDecline() {
        return _.filter(this.selectedShiftsList, (selectedShiftsList) => (
          [
            RosterShiftCandidatesVerifications.NOT_YET_VERIFIED,
            RosterShiftCandidatesVerifications.CANDIDATE_SUBMITTED,
            null,
          ].indexOf(selectedShiftsList.verification) > -1
        ));
      },

      shiftsToAdjust() {
        return _.filter(this.selectedShiftsList, (selectedShiftsList) => (
          [
            RosterShiftCandidatesVerifications.NOT_YET_VERIFIED,
            RosterShiftCandidatesVerifications.CANDIDATE_SUBMITTED,
            RosterShiftCandidatesVerifications.APPROVED,
            RosterShiftCandidatesVerifications.PREAPPROVED,
            RosterShiftCandidatesVerifications.AUTO_APPROVED,
            null,
          ].indexOf(selectedShiftsList.verification) > -1
          && (selectedShiftsList.position.position_id || selectedShiftsList.position_group.position_group_id)
          && !Object.keys(_.filter(selectedShiftsList.errors, (error) => error.severity === 'error')).length
        ));
      },

      shiftsWithoutPosition() {
        return _.filter(this.selectedShiftsList, (selectedShiftsList) => (
          !selectedShiftsList.position.position_id && !selectedShiftsList.position_group.position_group_id
        ));
      },

      onLeave() {
        return _.filter(this.selectedShiftsList, (selectedShiftsList) => (
          (selectedShiftsList.verification == RosterShiftCandidatesVerifications.ON_LEAVE)
        ));
      },

      shiftsWithErrors() {
        return _.filter(this.selectedShiftsList, (selectedShiftsList) => (
          Object.keys(_.filter(selectedShiftsList.errors, (error) => error.severity === 'error')).length
        ));
      },

      ...mapState('ApproveShift', [
        'selectedRosterBranch',
        'selectedShiftsList',
        'isDisabled',
        'bulkModalType',
        'isProvideLeaveRule',
        'showMoreRateOptions',
      ]),

      ...mapGetters('ApproveShift', [
        'isHoliday',
      ]),

      ...mapGetters('App', [
        'getSetting',
      ]),
    },

    methods: {

      handleHolidayRateToggle(e, rate) {
        this.holidayRate = rate;
      },

      momentFormat(time, format) {
        return helpers.momentFormat(time, format);
      },

      handleClose() {
        this.setShowApproveShiftsBulkModal(false).then(() => {
          this.setSelectedShiftsList('');
          this.setShowBulkAction(false);
        });
      },

      getShiftsWithHoliday() {
        _.forEach(this.shiftsToApprove, (shift) => {
          const holiday = this.isHoliday(moment(shift.estimated_time.estimated_start).format('YYYY-MM-DD'), shift.roster_branch_state, shift.client_id, shift.roster_branch_id, shift.employee_id, shift.roster_branch_location);
          if (holiday) {
            this.shiftsHoliday.push(shift.id);
            this.holidaysArray.push(holiday);
          }
        });
      },

      isPreApproved(shift) {
        const currentTime = moment().format('YYYY-MM-DD HH:mm:00');
        return currentTime < shift.estimated_time.estimated_end;
      },

      handleApprove(e) {
        e.preventDefault();
        const shift = [];
        _.forEach(this.shiftsToApprove, (shifts) => {
          let payHolidayRate = null;
          if (this.shiftsHoliday.includes(shifts.id)) {
            if (shifts.employee_type === 'casual') {
              payHolidayRate = null;
            } else {
              payHolidayRate = this.holidayRate;
            }
          }
          const data = {
            shift_id: shifts.id,
            estimated_start: shifts.estimated_time.estimated_start,
            estimated_end: shifts.estimated_time.estimated_end,
            estimated_break_length: shifts.estimated_time.estimated_break_length,
            is_pre_approved: this.isPreApproved(shifts),
            is_holiday: payHolidayRate,
            roster_id: shifts.roster_branch_id,
          };
          shift.push(data);
        });

        this.setShowBulkAction(false);
        this.approveShift(shift).then(() => {
          this.setSelectedShiftsList('');
        });
      },

      handleDecline(e) {
        e.preventDefault();
        const shift = [];
        const reason = this.reason ? this.reason.split(',') : null;
        const leave_rule = [{
          absent_comment: this.comment,
          leave_pay_nopay: '',
          leave_rule_amount: null,
          leave_rule_id: null,
          leave_title: null,
          reason: reason ? reason[1] : null,
          reason_id: reason ? reason[0] : null,
        }];
        _.forEach(this.shiftsToDecline, (shifts) => {
          let data = {
            shift_id: shifts.id,
            clock_id: shifts.clock_log_id,
            reason_id: this.reason,
            absent_comment: this.comment,
            roster_id: shifts.roster_branch_id,
          };
          if (this.isProvideLeaveRule && (reason || this.comment)) {
            data = { ...data, leave_rule };
          }
          shift.push(data);
        });

        this.setShowBulkAction(false);
        this.declineShift(shift).then(() => {
          this.setSelectedShiftsList('');
        });
      },

      handleAdjustEndTimeSave(e) {
        e.preventDefault();
        const shift = [];

        _.forEach(this.shiftsToAdjust, (shifts) => {
          let adjustedEnd = shifts.estimated_time.estimated_end;
          if (this.adjustEndTimeType == '0') {
            adjustedEnd = moment(shifts.estimated_time.estimated_end, 'YYYY-MM-DD HH:mm:ss').subtract(this.adjustedNewEndTime, 'minutes').format('YYYY-MM-DD HH:mm:ss');
          } else {
            adjustedEnd = moment(shifts.estimated_time.estimated_end, 'YYYY-MM-DD HH:mm:ss').add(this.adjustedNewEndTime, 'minutes').format('YYYY-MM-DD HH:mm:ss');
          }

          const data = {
            shift_start: shifts.estimated_time.estimated_start,
            shift_end: adjustedEnd,
            shift_id: shifts.id,
            roster_id: shifts.roster_branch_id,
          };
          shift.push(data);
        });
        this.setShowBulkAction(false);
        this.adjustEndTime(shift).then(() => {
          this.setSelectedShiftsList('');
        });
      },

      handleAdjustEndChange(time) {
        let { hours, minutes } = time;

        // - force number type
        hours = +hours;
        minutes = +minutes;

        this.adjustedNewEndTime = hours ? (hours * 60) + minutes : minutes;
      },

      handleAdjustEndTimeTypeToggle(val) {
        this.adjustEndTimeType = val;
      },

      handleLeaveTypeCasual(val) {
        this.leaveTypeCasual = val;
      },

      handleLeaveTypeFull(val) {
        this.leaveTypeFull = val;
      },

      handleReason(val) {
        this.reason = val;
      },
      ...mapActions('ApproveShift', [
        'setShowApproveShiftsBulkModal',
        'approveShift',
        'declineShift',
        'setSelectedShiftsList',
        'setShowBulkAction',
        'adjustEndTime',
      ]),
    },

    components: {
      modal: Modal,
      'leave-type-selector': LeaveTypeSelector,
      'reason-list-selector': ReasonListSelector,
      'text-duration-time-picker': TextDurationTimePicker,
    },
  };
</script>

<style>
    .bulk-action-info {
        border: 1px solid #eeee;
        padding: 10px;
        box-shadow: 0 1px 2px #eeee;
    }

    .bulk-action-extra-info {
        margin-top: 20px;
    }
</style>
