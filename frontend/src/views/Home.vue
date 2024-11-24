<template>
    <Header />
    <div class="container">
        <h1>Football</h1>

        <div class="tabs">
            <div class="tab active">All games</div>
        </div>

        <div class="filters">
            <input placeholder="Quick search" type="text" v-model="searchTerm" />
            <input placeholder="Start date" type="date" v-model="startDate" />
            <input placeholder="End date" type="date" v-model="endDate" />


            <Multiselect v-model="selectedRegion" :options="regions" placeholder="Select a region" label="name"
                class="custom-multiselect" track-by="name" @update:modelValue="filterResults" />

            <button @click="filterResults">Filter</button>
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th>Team</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Region</th>
                    <th>League</th>
                    <th>1</th>
                    <th>x</th>
                    <th>2</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="isLoading">
                    <td colspan="8">
                        <skeleton-loader width="80px" height="20px"></skeleton-loader>
                    </td>
                </tr>
                <tr v-for="game in paginatedGames" :key="game.match_code" @click="openStat(game.match_code)">
                    <td>{{ game.team }}</td>
                    <td>{{ formatDate(game.match_datetime) }}</td>
                    <td>{{ formatTime(game.match_datetime) }}</td>
                    <td>{{ game.region }}</td>
                    <td>{{ game.league }}</td>
                    <td>{{ game.odds["1"] }}</td>
                    <td>{{ game.odds["x"] }}</td>
                    <td>{{ game.odds["2"] }}</td>
                </tr>
                <tr v-if="!isLoading && filteredGames.length === 0">
                    <td colspan="8" class="text-center">No record found</td>
                </tr>
            </tbody>
        </table>

        <!-- Pagination -->
        <div class="d-flex align-items-center justify-content-between">
            <div>
                <label for="itemsPerPage" class="me-2">Items per page:</label>
                <select v-model="itemsPerPage" @change="changeItemsPerPage" class="form-select d-inline-block w-auto">
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="all">All</option>
                </select>
            </div>

            <nav aria-label="Page navigation">
                <ul class="pagination mb-0">
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                        <button class="page-link" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
                            Previous
                        </button>
                    </li>
                    <li class="page-item disabled">
                        <span class="page-link">Page {{ currentPage }} of {{ totalPages }}</span>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                        <button class="page-link" @click="changePage(currentPage + 1)"
                            :disabled="currentPage === totalPages">
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        </div>


        <div v-if="loading" class="modal d-block" tabindex="-1" role="dialog" aria-modal="true"
            style="background: rgba(0, 0, 0, 0.5);">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-body text-center">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import axios from 'axios';

import 'vue-multiselect/dist/vue-multiselect.min.css';
import Header from "@/components/Header.vue";
import SkeletonLoader from "@/components/SkeletonLoader.vue";
const backendUrl = process.env.VUE_APP_BACKEND_URL || 'http://localhost:5008'; //Backend URL for API requests

export default {
    components: {
        Multiselect,
        Header, //Main page header component
        SkeletonLoader //Loader component for displaying placeholders while data loads
    },
    data() {
        return {
            isLoading: true,
            games: [],
            regions: [],
            searchTerm: '',
            startDate: '',
            endDate: '',
            selectedRegion: '',
            selectedGame: {},
            loading: false,
            itemsPerPage: 20,
            currentPage: 1,
        };
    },
    computed: {
        //Calculates the total number of pages for paginated games
        totalPages() {
            return this.itemsPerPage === 'all' ? 1 : Math.ceil(this.filteredGames.length / this.itemsPerPage);
        },
        //Filters games based on the search term
        filteredGames() {
            return this.games.filter(game => {
                const searchLower = this.searchTerm.toLowerCase();
                return (
                    game.team.toLowerCase().includes(searchLower) ||
                    game.region.toLowerCase().includes(searchLower) ||
                    game.league.toLowerCase().includes(searchLower)
                );
            });
        },
        //Returns the current page's games based on pagination
        paginatedGames() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + (this.itemsPerPage === 'all' ? this.filteredGames.length : this.itemsPerPage);
            return this.filteredGames.slice(start, end);
        }
    },
    mounted() {
        //Fetch data from backend when the component is mounted
        this.fetchRegions();
        this.fetchGames();
    },
    methods: {
        async fetchRegions() {
            //Fetches available regions from the backend
            try {
                const response = await axios.get(`${backendUrl}/regions`);
                this.regions = response.data;
            } catch (error) {
                console.error("Error fetching regions:", error);
            } finally {

            }
        },
        async fetchGames() {
            //Fetches the list of games based on selected filters
            try {
                const response = await axios.get(`${backendUrl}/games`, {
                    params: {
                        region: this.selectedRegion.name,
                        startDate: this.startDate,
                        endDate: this.endDate,
                        searchTerm: this.searchTerm,
                    }
                });
                this.games = response.data;
            } catch (error) {
                console.error("Error fetching games:", error);
            } finally {
                this.loading = false;
                this.isLoading = false;
            }
        },
        //Change the current page for pagination
        changePage(page) {
            if (page > 0 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
        //Reset pagination to the first page when items-per-page changes
        changeItemsPerPage() {
            this.currentPage = 1;
        },
        //Navigates to the stats page for a match is clicked
        openStat(match_code) {
            this.$router.push({ name: 'Stats', params: { match_code } });
        },
        //Triggers a new game fetch with current filters
        filterResults() {
            this.loading = true;
            this.currentPage = 1;
            this.fetchGames();
        },
        //Formats datetime string into a readable date
        formatDate(datetime) {
            const date = new Date(datetime);
            return date.toLocaleDateString();
        },
        //Extracts and formats the time portion of a datetime string
        formatTime(datetime) {
            const time = datetime.split(" ")[1];
            return time.substring(0, 5);
        },
    },
};
</script>


<style>
.container {
    max-width: 80%;
    margin: 0 auto;
    background-color: #fff;
    padding: 15px;
}

h1 {
    font-size: 32px;
    font-weight: bold;
}

.tabs {
    display: flex;
    border-bottom: 1px solid #ddd;
    margin-bottom: 20px;
}

.tab {
    padding: 10px 20px;
    cursor: pointer;
}

.tab.active {
    border-bottom: 2px solid #000;
    font-weight: bold;
}

.tab.inactive {
    color: #aaa;
}

.filters {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.filters input,
.filters select,
.filters button {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #f9f9f9;
}

.filters button {
    background-color: #000;
    color: #fff;
    cursor: pointer;
}

.filters button.export {
    background-color: #fff;
    color: #000;
    border: 1px solid #ddd;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 10px;
    border-bottom: 1px solid #ddd;
    text-align: left;
}

th {
    background-color: #f9f9f9;
}

tr {
    cursor: pointer;
}

.custom-multiselect {
    height: 40px;
}
</style>