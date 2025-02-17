import { AngleDoubleDownIcon, AngleDoubleUpIcon, EqualsIcon } from '@patternfly/react-icons';
import { global_palette_blue_300 as blue300 } from '@patternfly/react-tokens/dist/js/global_palette_blue_300';
import { global_palette_blue_50 as blue50 } from '@patternfly/react-tokens/dist/js/global_palette_blue_50';
import { global_palette_gold_400 as gold400 } from '@patternfly/react-tokens/dist/js/global_palette_gold_400';
import { global_palette_orange_300 as orange300 } from '@patternfly/react-tokens/dist/js/global_palette_orange_300';
import { global_palette_red_200 as red200 } from '@patternfly/react-tokens/dist/js/global_palette_red_200';
import * as _ from 'lodash';
import { PrometheusResponse } from '@console/internal/components/graphs';
import CriticalIcon from './CriticalIcon';

export const riskIcons = {
  low: AngleDoubleDownIcon,
  moderate: EqualsIcon,
  important: AngleDoubleUpIcon,
  critical: CriticalIcon,
};

export const colorScale = [red200.value, orange300.value, gold400.value, blue50.value];

export const legendColorScale = {
  low: blue300.value,
  moderate: gold400.value,
  important: orange300.value,
  critical: red200.value,
};

export const riskSorting = {
  low: 0,
  moderate: 1,
  important: 2,
  critical: 3,
};

type Metrics = {
  critical?: number;
  important?: number;
  low?: number;
  moderate?: number;
};

export const mapMetrics = (response: PrometheusResponse): Metrics => {
  const values: Metrics = {};
  for (let i = 0; i < response.data.result.length; i++) {
    const value = response.data?.result?.[i]?.value?.[1];
    if (_.isNil(value)) {
      return null;
    }
    const metricName = response.data?.result?.[i]?.metric?.metric;
    if (values[metricName] === -1 || values[metricName] === undefined) {
      values[metricName] = parseInt(value, 10);
    }
  }

  return values;
};

// An error occurred while requesting Insights results (e.g. IO is turned off)
export const isError = (values: Metrics) => _.isEmpty(values);

// Insights Operator has been just initialized and waiting for the first results
export const isWaiting = (values: Metrics) =>
  Object.values(values).some((cur: number) => cur === -1);

// Insights Operator is disabled by removing the pull secret
export const isDisabled = (response) => !!parseInt(response?.data?.result?.[0]?.value?.[1], 10);
