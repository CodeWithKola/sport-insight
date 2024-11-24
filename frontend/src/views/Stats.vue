<template>
    <Header />
    <div class="container-fluid">
        <!-- Row 1 -->
        <div class="row mb-12 team-info" style=" border-right: thin groove #c0c0c033;">


            <div class="col-md-8" style="
    border-right: thin groove #c0c0c033;">
                <div class="row">
                    <div class="col-md-12">
                        <div class="card">
                            <div v-if="isLoading">
                                <skeleton-loader class="skeleton-loader" width="100%" height="20px"></skeleton-loader>
                            </div>
                            <div v-else>
                                <div class="row">
                                    <div class="col-md-9">

                                        <div class="match-header">
                                            <span class="region">{{ matchInfo?.region }}</span>
                                            &nbsp;&nbsp;|&nbsp;&nbsp;
                                            <span class="game-date">{{ matchInfo?.match_datetime ?
                                formatDate(matchInfo.match_datetime) : '' }}</span>
                                        </div>

                                        <div class="match">
                                            <div class="team team-a">{{ matchInfo.home }}</div>
                                            <span class="vs">vs</span>
                                            <div class="team team-b">{{ matchInfo.away }}</div>
                                        </div>
                                        <div class="team-game">{{ matchInfo.league }}</div>

                                    </div>
                                    <div class="col-md-3">
                                        <div class="last-five-games-title">Last 5 matches</div>
                                        <div class="last-five-games" style="margin-top: 15px;">
                                            <span>Home</span>
                                            <div v-for="(result, index) in homeMatchResults" :key="'home-' + index"
                                                :class="['game-indicator', result.toLowerCase()]">
                                                {{ result }}
                                            </div>
                                        </div>
                                        <div class="last-five-games">
                                            <span>Away&nbsp;</span>
                                            <div v-for="(result, index) in awayMatchResults" :key="'away-' + index"
                                                :class="['game-indicator', result.toLowerCase()]">
                                                {{ result }}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
                <div class="row">

                    <div class="col-md-4">
                        <div class="row row-cols-1 g-3">
                            <div class="col summary-cards">
                                <div class="card border">
                                    <div v-if="isLoading">
                                        <skeleton-loader width="80px" height="20px"></skeleton-loader>
                                    </div>
                                    <div v-else class="card-body">
                                        <h6 class="card-title">Head to Head</h6>
                                        <p class="card-text">{{ h2hMatches.length }}</p>

                                    </div>
                                </div>
                            </div>
                            <div class="col summary-cards">
                                <div class="card border">
                                    <div v-if="isLoading">
                                        <skeleton-loader width="80px" height="20px"></skeleton-loader>
                                    </div>
                                    <div v-else class="card-body">
                                        <h6 class="card-title">Home</h6>
                                        <p class="card-text">{{ homeMatches.length }}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="col summary-cards">
                                <div class="card border">
                                    <div v-if="isLoading">
                                        <skeleton-loader width="80px" height="20px"></skeleton-loader>
                                    </div>
                                    <div v-else class="card-body">
                                        <h6 class="card-title">Away</h6>
                                        <p class="card-text">{{ awayMatches.length }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-8">
                        <div v-if="isLoading">
                            <skeleton-loader width="100%" height="300px" class="shimmer"></skeleton-loader>
                        </div>

                        <match-history-chart v-if="!isLoading" :head2head="homeMatches" />

                    </div>

                    <hr />
                    <div class="col-md-12">
                        <div class="card border-0">
                            <div class="card-header bg-white p-4">
                                <h6 class="mb-0 fs-5">Head to Head</h6>
                            </div>
                            <div class="card-body p-0">
                                <div class="table-responsive">
                                    <div class="table-scrollable">
                                        <table class="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Home</th>
                                                    <th>Away</th>
                                                    <th>HT</th>
                                                    <th>FT</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-if="isLoading">
                                                    <td colspan="5">
                                                        <skeleton-loader width="80px" height="20px"></skeleton-loader>
                                                    </td>
                                                </tr>
                                                <tr v-for="(match, index) in displayedH2h" :key="index">
                                                    <td>{{ formatDate(match.match_date) }}</td>
                                                    <td>{{ match.home_team_name }}</td>
                                                    <td>{{ match.away_team_name }}</td>
                                                    <td>{{ match.home_ht_score + ':' + match.away_ht_score }}</td>
                                                    <td>{{ match.home_ft_score + ':' + match.away_ft_score }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="text-center" v-if="h2hMatches.length > 10">
                                        <button class="btn btn-link" @click="toggleH2h">
                                            {{ showAllH2h ? "Show Less" : "Load More" }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div class="col-md-4">


                <!-- Home Matches Table -->

                <div class="cards">
                    <div class="card-header bg-white p-4">
                        <h6 class="mb-0 fs-5">Home Matches</h6>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <div class="table-scrollable">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Home</th>
                                            <th>Away</th>
                                            <th>HT</th>
                                            <th>FT</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-if="isLoading">
                                            <td colspan="5">
                                                <skeleton-loader width="80px" height="20px"></skeleton-loader>
                                            </td>
                                        </tr>
                                        <tr v-for="(match, index) in displayedHomeMatches" :key="index">
                                            <td>{{ formatDate(match.match_date) }}</td>
                                            <td>{{ match.home_team_name }}</td>
                                            <td>{{ match.away_team_name }}</td>
                                            <td>{{ match.home_ht_score + ':' + match.away_ht_score }}</td>
                                            <td>{{ match.home_ft_score + ':' + match.away_ft_score }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="text-center" v-if="homeMatches.length > 10">
                                <button class="btn btn-link" @click="toggleHome">
                                    {{ showAllHome ? "Show Less" : "Load More" }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Away Matches Table -->
                <hr />
                <div class="cards">
                    <div class="card-header bg-white p-4">
                        <h6 class="mb-0 fs-5">Away Matches</h6>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <div class="table-scrollable">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Home</th>
                                            <th>Away</th>
                                            <th>HT</th>
                                            <th>FT</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-if="isLoading">
                                            <td colspan="5">
                                                <skeleton-loader width="80px" height="20px"></skeleton-loader>
                                            </td>
                                        </tr>
                                        <tr v-for="(match, index) in displayedAwayMatches" :key="index">
                                            <td>{{ formatDate(match.match_date) }}</td>
                                            <td>{{ match.home_team_name }}</td>
                                            <td>{{ match.away_team_name }}</td>
                                            <td>{{ match.home_ht_score + ':' + match.away_ht_score }}</td>
                                            <td>{{ match.home_ft_score + ':' + match.away_ft_score }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="text-center" v-if="awayMatches.length > 10">
                                <button class="btn btn-link" @click="toggleAway">
                                    {{ showAllAway ? "Show Less" : "Load More" }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <!-- Head to Head Table Column -->
        </div>


    </div>
</template>

<script>
import axios from "axios";
import MatchHistoryChart from "../components/charts/MatchHistoryChart.vue";
import Header from "@/components/Header.vue";
import SkeletonLoader from "@/components/SkeletonLoader.vue";
const backendUrl = process.env.VUE_APP_BACKEND_URL || 'http://localhost:5008';//Backend URL for API requests
export default {
    components: {
        MatchHistoryChart, //Chart component to display match history
        Header, //Main page header component
        SkeletonLoader //Loader for displaying placeholders while fetching data
    },
    data() {
        return {
            isLoading: true,
            match_code: null,
            matchInfo: {},
            h2hMatches: [],
            homeMatches: [],
            awayMatches: [],
            showAllH2h: false,
            showAllHome: false,
            showAllAway: false,
            homeMatchResults: [],
            awayMatchResults: []
        };
    },
    async mounted() {
        //Get the match code from the route parameters and fetch related data
        this.match_code = this.$route.params.match_code;
        if (this.match_code) {
            await this.fetchMatchData();
        }
    },
    computed: {
        //Show up to 10 head-to-head records by default, and display all when "Load More" is clicked
        displayedH2h() {
            return this.showAllH2h ? this.h2hMatches : this.h2hMatches.slice(0, 10);
        },
        //Show up to 10 home matches by default, and display all when "Load More" is clicked
        displayedHomeMatches() {
            return this.showAllHome
                ? this.homeMatches
                : this.homeMatches.slice(0, 10);
        },
        //Show up to 10 away matches by default, and display all when "Load More" is clicked
        displayedAwayMatches() {
            return this.showAllAway
                ? this.awayMatches
                : this.awayMatches.slice(0, 10);
        },
    },
    methods: {
        //Toggles between showing all or a limited number of H2H matches
        toggleH2h() {
            this.showAllH2h = !this.showAllH2h;
        },
        //Toggles between showing all or a limited number of home matches
        toggleHome() {
            this.showAllHome = !this.showAllHome;
        },
        //Toggles between showing all or a limited number of away matches
        toggleAway() {
            this.showAllAway = !this.showAllAway;
        },
        //Formats datetime string into a human-readable date
        formatDate(datetime) {
            const date = new Date(datetime);
            return date.toLocaleDateString();
        },
        //Fetches match data, including H2H, home, and away matches
        async fetchMatchData() {
            try {
                const match = `${backendUrl}/games/?match=${this.match_code}`;
                const h2hUrl = `${backendUrl}/stats/${this.match_code}/h2h`;
                const homeUrl = `${backendUrl}/stats/${this.match_code}/home`;
                const awayUrl = `${backendUrl}/stats/${this.match_code}/away`;

                //Parallel requests to backend
                const [matchInfo, h2hResponse, homeResponse, awayResponse] = await Promise.all([
                    axios.get(match),
                    axios.get(h2hUrl),
                    axios.get(homeUrl),
                    axios.get(awayUrl),
                ]);

                this.matchInfo = matchInfo.data[0];
                this.h2hMatches = h2hResponse.data.reverse(); //Reverse the array to display the most recent matches first
                this.homeMatches = homeResponse.data.reverse(); //Reverse the array to display the most recent matches first
                this.awayMatches = awayResponse.data.reverse(); //Reverse the array to display the most recent matches first
                this.computeMatchOutcomes(); //Handles the outcome of the last 5 matches and categorizes them as Win, Loss, or Draw

                this.isLoading = false;

            } catch (error) {
                console.error("Error fetching match data:", error);
            }
        },
        computeMatchOutcomes() {
            //Resetting the stats for each team
            this.homeMatchResults = [];
            this.awayMatchResults = [];

            const homeTeamName = this.matchInfo.home;
            const awayTeamName = this.matchInfo.away;

            //Process match outcomes to determine W, L, D
            const processMatchResults = (matches, teamName, resultsArray) => {
                let count = 0;
                matches.slice().forEach(match => {
                    if (count >= 5) return; //Only process the last 5 matches

                    if (match.winner === "home") {
                        //Determine outcome based on the winning team
                        resultsArray.push(match.home_team_name === teamName ? "W" : "L");
                    } else if (match.winner === "away") {
                        resultsArray.push(match.away_team_name === teamName ? "W" : "L");
                    } else {
                        resultsArray.push("D"); //Match was a draw
                    }

                    count++;
                });
            };


            processMatchResults(this.homeMatches, homeTeamName, this.homeMatchResults);//Process Home recent matches
            processMatchResults(this.awayMatches, awayTeamName, this.awayMatchResults);//Process Away recent matches

        }


    },
};
</script>

<style scoped>
.container-fluid {
    background-color: #fff;
    padding: 20px;
}

.card {
    transition: transform 0.2s;
}

.card:hover {
    transform: translateY(-2px);
}

.table {
    margin-bottom: 0;
}

.table th {
    border-top: none;
}

.btn-link {
    text-decoration: none;
}

.table-responsive {
    margin-bottom: 0;
}

.table-scrollable {
    max-height: 600px;
    overflow-y: scroll;
}

.summary-cards .card {
    height: 145px;
    border-radius: 25px;
    background: #f8fcfd;
}

.summary-cards .skeleton-loader {
    overflow: hidden;
    height: 100px;
}

.border {
    border: thin groove #edeef057 !important;
}

.mc-top-radius {
    border-top-left-radius: 25px !important;
    border-top-right-radius: 25px !important;
}

.mc-bottom-radius {
    border-bottom-left-radius: 25px !important;
    border-bottom-right-radius: 25px !important;
}

.card-header {
    border: transparent;
}

thead th {
    color: #9d9d9d;
    font-size: 14px;
    font-weight: 600;
    border: transparent;
    padding-left: 1.5rem !important;
    padding-right: 1.5rem !important;
    padding-top: 13px !important;
    padding-bottom: 13px !important;
}

td,
td {
    font-size: 13px;
    padding-left: 1.5rem !important;
    padding-right: 1.5rem !important;
    padding-top: 13px !important;
    padding-bottom: 13px !important;
    font-weight: 500;
    border-color: #f2f2f2;
}

hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border-color: #a0a0a0;
}



.team-info .card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 16px;
    background-color: #f9f9f9;
    margin-bottom: 16px;
}

.match-header {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
}

.region {
    font-size: 1rem;
    color: #555;
    font-weight: normal;
}

.game-date {
    font-size: 1rem;
    color: #888;
    font-weight: normal;
}

.match {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: center;
}

.team {
    flex: 1;
    font-size: 2.5rem;

    font-weight: bold;
    margin: 0 8px;
}

.vs {
    flex-shrink: 0;
    margin: 0 10px;
    font-size: 1.2rem;
}

.team-a {
    color: #007bff;
}

.team-b {
    color: #dc3545;
}


.team-game {
    font-size: 1rem;
    color: #888;
    margin-top: 8px;
}

.info {
    font-size: 1rem;
    color: #333;
    background-color: #eef;
    padding: 8px;
    border-radius: 4px;
}

.last-five-games span {
    font-size: 0.9rem;
    color: #555;
    font-weight: normal;
    line-height: 30px;
}

.last-five-games-title {
    font-size: 1rem;
    color: #555;
}

.last-five-games {
    display: flex;
    gap: 8px;
    margin-top: 10px;
}

.game-indicator {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    color: white;
}

.game-indicator.w {
    background-color: #28a745;
}

.game-indicator.l {
    background-color: #dc3545;
}

.game-indicator.d {
    background-color: #ffc107;
}
</style>
