<template>
    <div class="chart-container">
        <!-- Select chart type -->
        <select v-model="selectedChartType" @change="updateChart" class="form-select mb-3 w-auto float-end"
            aria-label="Select chart type">
            <option value="goals">Goals</option>
            <option value="2OrMore">Over 1.5</option>
            <option value="3OrMore">Over 2.5</option>
            <option value="4OrMore">Over 3.5</option>
            <option value="goalGoal">GG</option>
            <option value="drawWin">Draw</option>
        </select>
        <div class="clear"></div>
        <div v-if="isDataReady">
            <!--  Render BarChart or PieChart based on user selection -->
            <div v-if="selectedChartType === 'goals'" style="width: 100%; height: 100%; position: absolute;">
                <BarChart :data="chartData" :options="chartOptions" />
            </div>
            <div v-else style="width: 100%; height: 100%; position: absolute;  background: #f8fcfd;">
                <PieChart :data="pieChartData" :options="pieChartOptions" />
            </div>
        </div>
        <div v-else class="loading">
            Loading chart data...
        </div>
    </div>
</template>

<script>
//Vue component that creates charts to visualize match history data.
//We're using vue-chartjs (a wrapper for Chart.js).
import { Bar, Pie } from 'vue-chartjs'
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js'

//Register the chart components
ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    ArcElement
)

export default {
    name: 'MatchHistoryChart',
    components: {
        BarChart: Bar,
        PieChart: Pie
    },
    //We expect an array of head-to-head match data from the parent component
    props: {
        head2head: {
            type: Array,
            required: true,
            default: () => []
        }
    },
    //Keep track of which type of chart we're showing
    data() {
        return {
            selectedChartType: 'goals' //default chart type
        }
    },
    computed: {
        //Make sure we have data before trying to show any charts
        isDataReady() {
            return this.head2head?.length > 0
        },
        //This handles the bar chart data showing goals scored by each team
        chartData() {
            if (!this.isDataReady || this.selectedChartType !== 'goals') {
                return {
                    labels: [],
                    datasets: []
                }
            }
            //Extract match dates for x-axis and scores for the bars
            const labels = this.head2head.map(match => match.match_date)
            const homeScores = this.head2head.map(match => match.home_ft_score)
            const awayScores = this.head2head.map(match => match.away_ft_score)

            return {
                labels,
                datasets: [
                    {
                        label: 'Home',
                        backgroundColor: '#42A5F5',
                        data: homeScores,
                        borderRadius: 6,
                    },
                    {
                        label: 'Away',
                        backgroundColor: '#FF6384',
                        data: awayScores,
                        borderRadius: 6,
                    }
                ]
            }
        },
        //Configuration for how the bar chart looks and behaves
        chartOptions() {
            return {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        grid: {
                            borderDash: [2, 4]
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        },
        //This handles all our pie chart variations based on the selected type
        pieChartData() {
            if (!this.isDataReady || this.selectedChartType === 'goals') return null;

            const homeGoalsCount = this.head2head.map(match => match.home_ft_score)
            const awayGoalsCount = this.head2head.map(match => match.away_ft_score)
            let data = [];
            //Calculate different stats based on what the user wants to see
            switch (this.selectedChartType) {
                case '2OrMore': //Games with 2 or more goals (Over 1.5)
                    const twoOrMoreGoals = homeGoalsCount.filter(goals => goals >= 2).length;
                    const awayTwoOrMoreGoals = awayGoalsCount.filter(goals => goals >= 2).length;
                    const lessThanTwoGoals = (homeGoalsCount.length - twoOrMoreGoals) + (awayGoalsCount.length - awayTwoOrMoreGoals);
                    data = [twoOrMoreGoals + awayTwoOrMoreGoals, lessThanTwoGoals];
                    break;
                case '3OrMore': //Games with 3 or more goals (Over 2.5)
                    const threeOrMoreGoals = homeGoalsCount.filter(goals => goals >= 3).length;
                    const awayThreeOrMoreGoals = awayGoalsCount.filter(goals => goals >= 3).length;
                    const lessThanThreeGoals = (homeGoalsCount.length - threeOrMoreGoals) + (awayGoalsCount.length - awayThreeOrMoreGoals);
                    data = [threeOrMoreGoals + awayThreeOrMoreGoals, lessThanThreeGoals];
                    break;
                case '4OrMore': //Games with 4 or more goals (Over 3.5)
                    const fourOrMoreGoals = homeGoalsCount.filter(goals => goals >= 4).length;
                    const awayFourOrMoreGoals = awayGoalsCount.filter(goals => goals >= 4).length;
                    const lessThanFourGoals = (homeGoalsCount.length - fourOrMoreGoals) + (awayGoalsCount.length - awayFourOrMoreGoals);
                    data = [fourOrMoreGoals + awayFourOrMoreGoals, lessThanFourGoals];
                    break;
                case 'goalGoal'://Both teams scored (GG)
                    const goalGoal = this.head2head.filter(match => match.home_ft_score > 0 && match.away_ft_score > 0).length;
                    const noGoalGoal = this.head2head.length - goalGoal;
                    data = [goalGoal, noGoalGoal];
                    break;
                case 'drawWin'://Draw or any team winning 
                    const draw = this.head2head.filter(match => match.home_ft_score === match.away_ft_score).length;
                    const win = this.head2head.length - draw;
                    data = [draw, win];
                    break;
            }

            return {
                labels: this.pieChartLabels,
                datasets: [
                    {
                        data,
                        backgroundColor: ['#36A2EB', '#FF6384']
                    }
                ]
            }
        },
        //Labels for our pie charts changes based on what we're showing
        pieChartLabels() {
            switch (this.selectedChartType) {
                case '2OrMore':
                    return ['Over 1.5', 'Under 1.5'];
                case '3OrMore':
                    return ['Over 2.5', 'Under 2.5'];
                case '4OrMore':
                    return ['Over 3.5', 'Under 3.5'];
                case 'goalGoal':
                    return ['GG', 'No GG'];
                case 'drawWin':
                    return ['Draw', 'Anybody Wins'];
                default:
                    return [];
            }
        },
        //Configuration for how the pie charts look
        pieChartOptions() {
            return {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                }
            }
        }
    },
    methods: {
        updateChart() {

        }
    }
}
</script>

<style scoped>
.chart-container {
    position: relative;
    height: 90%;
    width: 100%;
    background: #f8fcfd;
    padding: 10px;
}

.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 1.1em;
    color: #666;
}

.clear {
    clear: both
}
</style>
