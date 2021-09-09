<template>
  <div class="container review-section-table fu-form">
    <div class="row">
      <div class="col">
        <div class="pull-right">
          <button
            class="btn-sm btn-inverse"
            style="font-size:14px"
            @click="handleShowEditRates"
          >
            Edit
          </button>
          <button
            class="error btn-sm btn-inverse"
            style="font-size:14px"
            @click="handleBulkDeletePosition"
          >
            Delete All
          </button>
        </div>
      </div>
    </div>

    <div class="row review-section-header">
      <div class="col-4">
        <span>Position</span>
      </div>
      <div class="col-2 d-flex justify-content-center">
        <span>Locations</span>
      </div>
      <div class="col-2 d-flex justify-content-center">
        <span>Rate</span>
      </div>
      <div class="col-3 d-flex justify-content-center">
        <span>Date</span>
      </div>
      <div class="col-1">
        <span />
      </div>
    </div>

    <div
      v-for="(position,index) in positions"
      :key="'casual-position-tmp-'+index"
      class="row review-section-body"
    >
      <div class="col-4 d-flex align-items-center">
        <strong v-show="position.custom_position_title">{{ position.custom_position_title }}<br></strong>
        <strong>{{ position.position_label }}</strong><br>
        <span>{{ position.position_short_title }}</span><br>
        <span v-if="position.cost_code_label">
          {{ position.cost_code_label + ' ('+position.cost_code_option+')' }}
        </span>
      </div>
      <div class="col-2 d-flex justify-content-center align-items-center">
        <span>{{ position.location_labels }}</span>
      </div>
      <div class="col-2 d-flex justify-content-center align-items-center">
        <span v-if="!editRates && !position.use_operation_rates_book">
          ${{ position.rate }}
        </span>
        <span v-if="position.use_operation_rates_book">Use operation rates book</span>
        <div
          v-if="editRates && !position.use_operation_rates_book"
          class="employment-position-update-form-section"
        >
          <div
            class="dollar-input-wrapper display-inline-block"
            :class="{'border-brand': editRates}"
          >
            <span>$</span>
            <input
              v-model="position.rate"
              type="number"
              min="0"
              step="0.01"
              style="padding: 5px"
            >
          </div>
        </div>
      </div>
      <div class="col-3 d-flex justify-content-center align-items-center">
        <div v-if="editRates">
          <small>Start Date</small>
          <date-picker
            :default-date="position.start_date"
            :disabled-dates="disabledDates"
            @change="(val) => { position.start_date = (val <= position.end_date) ? val : null}"
          />
          <small>End Date</small>
          <date-picker
            :default-date="position.end_date"
            :disabled-dates="disabledEndDates"
            @change="(val) => { position.end_date = (val >= position.start_date) ? val : null}"
          />
        </div>
        <div
          v-else
          class="text-center"
        >
          <span>{{ momentFormat(position.start_date) }}</span>
          <span v-if="position.end_date"> - {{ momentFormat(position.end_date) }}</span>
        </div>
      </div>
      <div class="col-1 d-flex justify-content-end align-items-center">
        <span
          class="cursor-pointer pull-right"
          @click="handleRemoveTmpPositions(index)"
        >
          <v-icon
            name="delete"
            class="text-delete"
            :width="16"
            :height="16"
          />
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment';
  import { mapActions, mapState, mapGetters } from 'vuex';
  import DatePicker from '../../../DatePicker.vue';

  export default {

    components: {
      'date-picker': DatePicker,
    },

    props: {
      positionsToSubmit: {
        type: Array,
        default: () => ([]),
      },

      disabledDates: {
        type: Object,
        default: () => ({}),
      },

      disabledEndDates: {
        type: Object,
        default: () => ({}),
      },
    },

    data() {
      return {
        positions: [],
        editRates: false,
      };
    },

    watch: {
      positions: {
        handler(val) {
          this.$emit('setPositionsToSubmit', val);
        },
        deep: true,
      },
    },

    mounted() {
      this.positions = JSON.parse(JSON.stringify(this.positionsToSubmit));
    },

    methods: {

      momentFormat(date) {
        return date ? moment(date).format('D MMMM YYYY') : 'Not Set';
      },

      handleShowEditRates() {
        this.editRates = !this.editRates;
      },
      
      handleBulkDeletePosition() {
        this.positions = [];
        console.log("Da het cot r");
      },

      handleRemoveTmpPositions(index) {
        if (index > -1) {
          this.positions.splice(index, 1);
        }
        else if (index <= -1) {
          console.log("Da het cot r");
        }
      },
    },

  };
</script>
