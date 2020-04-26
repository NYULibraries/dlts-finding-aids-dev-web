<template>
    <div>
        <b-container
            id="main-container"
            class="main-container h-100"
        >
            <navbar />

            <h1 id="header">
                Manage published finding aids
            </h1>

            <b-row>
                <b-col
                    lg="6"
                    class="my-1"
                >
                    <b-form-group
                        label="Filter"
                        label-cols-sm="3"
                        label-align-sm="right"
                        label-size="sm"
                        label-for="filterInput"
                        class="mb-0"
                    >
                        <b-input-group size="sm">
                            <b-form-input
                                id="filterInput"
                                v-model="filter"
                                type="search"
                                placeholder="Type to Search"
                            />
                            <b-input-group-append>
                                <b-button
                                    :disabled="!filter"
                                    @click="filter = ''"
                                >
                                    Clear
                                </b-button>
                            </b-input-group-append>
                        </b-input-group>
                    </b-form-group>
                </b-col>

                <b-col
                    lg="6"
                    class="my-1"
                >
                    <b-form-group
                        label="Filter On"
                        label-cols-sm="3"
                        label-align-sm="right"
                        label-size="sm"
                        description="Leave all unchecked to filter on all data"
                        class="mb-0"
                    >
                        <b-form-checkbox-group
                            v-model="filterOn"
                            class="mt-1"
                        >
                            <b-form-checkbox value="title">
                                Title
                            </b-form-checkbox>
                            <b-form-checkbox value="repository">
                                Repository
                            </b-form-checkbox>
                            <b-form-checkbox value="datetime">
                                Datetime
                            </b-form-checkbox>
                        </b-form-checkbox-group>
                    </b-form-group>
                </b-col>

                <b-col
                    sm="5"
                    md="6"
                    class="my-1"
                >
                    <b-form-group
                        label="Per page"
                        label-cols-sm="6"
                        label-cols-md="4"
                        label-cols-lg="3"
                        label-align-sm="right"
                        label-size="sm"
                        label-for="perPageSelect"
                        class="mb-0"
                    >
                        <b-form-select
                            id="perPageSelect"
                            v-model="perPage"
                            size="sm"
                            :options="pageOptions"
                        />
                    </b-form-group>
                </b-col>

                <b-col
                    sm="7"
                    md="6"
                    class="my-1"
                >
                    <b-pagination
                        v-model="currentPage"
                        :total-rows="totalRows"
                        :per-page="perPage"
                        align="fill"
                        size="sm"
                        class="my-0"
                    />
                </b-col>
            </b-row>

            <!-- Main table element -->
            <b-table
                show-empty
                small
                stacked="md"
                :items="items"
                :fields="fields"
                :current-page="currentPage"
                :per-page="perPage"
                :filter="filter"
                :filter-included-fields="filterOn"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :sort-direction="sortDirection"
                @filtered="onFiltered"
            >
                <template v-slot:cell(actions)="row">
                    <b-button
                        size="sm"
                        @click="row.toggleDetails"
                    >
                        {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
                    </b-button>
                </template>

                <template v-slot:row-details="row">
                    <b-card>
                        <ul>
                            <li
                                v-for="(value, key) in row.item"
                                :key="key"
                            >
                                {{ key }}: {{ value }}
                            </li>
                        </ul>
                    </b-card>
                </template>
            </b-table>
        </b-container>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

import moment from 'moment';

import Navbar from './Navbar';

export default {
    name       : 'ManagePublishedFindingAids',
    components : {
        Navbar,
    },
    data() {
        return {
            fields : [
                {
                    key           : 'repository',
                    label         : 'Repository',
                    sortable      : true,
                    sortDirection : 'asc',
                    class         : 'text-left',
                },
                {
                    key           : 'id',
                    label         : 'ID',
                    sortable      : true,
                    sortDirection : 'asc',
                    class         : 'text-left',
                },
                {
                    key           : 'title',
                    label         : 'Title',
                    sortable      : true,
                    sortDirection : 'asc',
                    class         : 'text-left text-wrap',
                },
                {
                    key               : 'datetime',
                    label             : 'Datetime',
                    formatter         : ( datetime ) => {
                        return moment( datetime * 1000 ).format( 'M/D/YYYY h:mm a' );
                    },
                    sortable          : true,
                    sortDirection     : 'desc',
                    filterByFormatted : true,
                    class             : 'text-left text-nowrap',
                },
                {
                    key   : 'actions',
                    label : 'Actions',
                    class : 'text-left text-nowrap',
                },
            ],
            totalRows     : 0,
            currentPage   : 1,
            perPage       : 10,
            pageOptions   : [ 10, 25, 50, 100 ],
            sortBy        : 'datetime',
            sortDesc      : true,
            sortDirection : 'desc',
            filter        : null,
            filterOn      : [],
        };
    },
    computed   : {
        items() {
            const items = [];

            Object.keys( this.publishedFindingAids ).forEach( repository => {
                const findingAids = this.publishedFindingAids[ repository ];

                Object.keys( findingAids ).forEach( id => {
                    const findingAid = findingAids[ id ];

                    items.push(
                        {
                            repository   : `${ this.repositories[ repository ].name } (${ repository })`,
                            id           : id,
                            title        : findingAid.title,
                            datetime     : findingAid.datetime,
                        },
                    );
                } );
            } );

            return items;
        },
        ...mapGetters(
            [
                'currentRepositories',
                'currentUser',
                'publishedFindingAids',
                'repositories',
            ],
        ),
    },
    watch      : {},
    mounted() {
        if ( ! this.currentUser ) {
            this.$router.push( { name : 'login' } );
        }

        this.totalRows = this.items.length;
    },
    methods    : {
        onFiltered( filteredItems ) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length;
            this.currentPage = 1;
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    #header {
        margin-top : 3%;
    }

    #results-col {
        height : 500px;
    }

    #results-textarea {
        border  : solid black 1px;
        padding : 1%;
    }

    #upload-row {
        padding : 2%;
    }

    .button {
        margin : 1%;
    }

    .row {
        padding : 1%;
    }
</style>
