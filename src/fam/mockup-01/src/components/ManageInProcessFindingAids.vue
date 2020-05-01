<template>
    <div>
        <b-container
            id="main-container"
            class="main-container h-100"
        >
            <navbar />

            <h1 id="header">
                Manage in-process finding aids
            </h1>

            <b-row id="controls-row">
                <b-col
                    class="my-1 text-left"
                    cols="6"
                >
                    {{ totalRows.toLocaleString() }} finding aids found
                </b-col>

                <b-col
                    class="my-1 text-right"
                    cols="2"
                >
                    <b-form-group
                        id="per-page-form-group"
                        label="Per page"
                        label-align="right"
                        label-cols="6"
                        label-size="sm"
                        label-for="per-page-select"
                        class="mb-0"
                    >
                        <b-form-select
                            v-model="perPage"
                            size="sm"
                            :options="pageOptions"
                        />
                    </b-form-group>
                </b-col>

                <b-col
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
                ref="table"
                bordered
                striped
                show-empty
                small
                stacked="md"
                :items="items"
                :fields="fields"
                :current-page="currentPage"
                :per-page="perPage"
                :filter="filter"
                :filter-function="customFilter"
                :sort-by.sync="sortBy"
                :sort-direction="sortDirection"
                @filtered="onFiltered"
            >
                <template v-slot:head(repository)="data">
                    <b-form-group
                        :label="data.label"
                        label-cols="auto"
                        label-align-sm="left"
                        label-for="repository-filter"
                        class="mb-0"
                    >
                        <b-form-select
                            id="repository-filter"
                            v-model="filter.repository"
                            :options="repositoryFilterOptions"
                            size="sm"
                        />
                    </b-form-group>
                </template>

                <template v-slot:head(id)="data">
                    <b-form-group
                        :label="data.label"
                        label-cols="auto"
                        label-align-sm="left"
                        label-for="id-filter"
                        class="mb-0"
                    >
                        <b-input-group size="sm">
                            <b-form-input
                                id="id-filter"
                                v-model="filter.id"
                                debounce="500"
                                type="search"
                            />
                        </b-input-group>
                    </b-form-group>
                </template>

                <template v-slot:head(title)="data">
                    <b-form-group
                        :label="data.label"
                        label-cols="auto"
                        label-align-sm="left"
                        label-for="title-filter"
                        class="mb-0"
                    >
                        <b-input-group size="sm">
                            <b-form-input
                                id="title-filter"
                                v-model="filter.title"
                                debounce="500"
                                type="search"
                            />
                        </b-input-group>
                    </b-form-group>
                </template>

                <template v-slot:cell(actions)="row">
                    <span
                        class="h1"
                    >
                        <b-icon
                            v-if="row.detailsShowing"
                            icon="caret-down-fill"
                            @click="row.toggleDetails"
                        />
                        <b-icon
                            v-else
                            icon="caret-left-fill"
                            @click="row.toggleDetails"
                        />
                    </span>
                </template>

                <template v-slot:row-details="row">
                    <div>
                        <b-button
                            class="action-button"
                            :href="`http://dlib.nyu.edu/findingaids/html/${ row.item.repositoryCode }/${ row.item.id }/`"
                            target="_blank"
                        >
                            View finding aid preview
                        </b-button>

                        <b-button
                            class="action-button"
                            :href="`http://dlib.nyu.edu/findingaids/ead/${ row.item.repositoryCode }/${ row.item.id }.xml`"
                            target="_blank"
                        >
                            View EAD file preview
                        </b-button>

                        <b-button
                            class="action-button"
                            :href="`http://dlib.nyu.edu/findingaids/ead/${ row.item.repositoryCode }/${ row.item.id }.xml`"
                            target="_blank"
                        >
                            Publish finding aid
                        </b-button>

                        <b-button
                            class="action-button"
                            :data-id="row.item.id"
                            :data-repository-code="row.item.repositoryCode"
                            variant="danger"
                            @click="clickDeleteInProcessFindingAid"
                        >
                            Delete finding aid previews
                        </b-button>
                    </div>
                </template>
            </b-table>
        </b-container>

        <b-modal
            id="confirm-delete-modal"
            header-text-variant="danger"
            size="lg"
            centered
            title="Confirm deletion"
            ok-title="Delete"
            ok-variant="danger"
            @cancel="cancelInProcessFindingAid"
            @ok="deleteInProcessFindingAid"
        >
            <p>
                Are you sure you wish to delete {{ deletion.repositoryCode }}/{{ deletion.id }}?
            </p>
            <p>This will delete the following:</p>
            <p></p>
            <ul>
                <li>
                    Finding aid: http://dlib.nyu.edu/findingaids/html/{{ deletion.repositoryCode }}/{{ deletion.id }}/
                </li>
                <li>
                    Public EAD file: http://dlib.nyu.edu/findingaids/ead/{{ deletion.repositoryCode }}/{{ deletion.id }}.xml
                </li>
                <li>
                    Search data: https://specialcollections.library.nyu.edu/search/
                </li>
                <li>
                    Github EAD file:
                    https://github.com/NYULibraries/findingaids_eads/blob/master/{{ deletion.repositoryCode }}/{{ deletion.id }}.xml
                </li>
            </ul>
        </b-modal>

        <b-modal
            id="queuing-delete-modal"
            centered
            no-close-on-esc
            no-close-on-backdrop
            hide-footer
            hide-header-close
            title="Queueing for deletion..."
        >
            <b-row>
                <b-col />
                <b-col align="center">
                    <b-spinner />
                </b-col>
                <b-col />
            </b-row>
        </b-modal>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import moment from 'moment';

import Navbar from './Navbar';

export default {
    name       : 'ManageInProcessFindingAids',
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
            items         : null,
            totalRows     : 0,
            currentPage   : 1,
            perPage       : 10,
            pageOptions   : [ 10, 25, 50, 100 ],
            sortBy        : 'repository',
            sortDirection : 'asc',
            filter        : {
                id         : null,
                repository : null,
                title      : null,
            },
            filterOn      : [ 'title' ],
            deletion : {
                id             : null,
                repositoryCode : null,
            },
        };
    },
    computed   : {
        repositoryFilterOptions() {
            const options = this.currentRepositories.map( repository => {
                return {
                    value : repository,
                    text  : repository,
                };
            } );

            options.unshift(
                {
                    value : null,
                    text  : 'All',
                },
            );

            return options;
        },
        ...mapGetters(
            [
                'currentRepositories',
                'currentUser',
                'inProcessFindingAids',
                'repositories',
            ],
        ),
    },
    watch      : {},
    mounted() {
        if ( ! this.currentUser ) {
            this.$router.push( { name : 'login' } );
        }

        this.refreshTableItems();

        this.totalRows = this.items.length;

        this.setHelpModal(
            {
                content : 'TODO',
                title   : 'Manage In-Process Finding Aids screen',
            },
        );
    },
    methods    : {
        cancelInProcessFindingAid() {
            this.clearInProcess();
        },
        clearInProcess() {
            this.deletion.id = null;
            this.deletion.repositoryCode = null;
        },
        clickDeleteInProcessFindingAid( event ) {
            this.deletion.id = event.currentTarget.dataset.id;
            this.deletion.repositoryCode = event.currentTarget.dataset.repositoryCode;

            this.$bvModal.show( 'confirm-deletion-modal' );
        },
        refreshTableItems() {
            this.items = this.getItems();
        },
        async deleteInProcessFindingAid() {
            this.$bvModal.show( 'queuing-deletion-modal' );

            await this.$sleep( 1000 );

            this.$bvModal.hide( 'queuing-deletion-modal' );

            this.deleteInProcessFindingAid(
                {
                    id         : this.deletion.id,
                    repository : this.deletion.repositoryCode,
                },
            );

            this.clearInProcess();

            const message =
                'The Github EAD file has been queued for deletion.' +
                ' The finding aid, public EAD file, and search data will' +
                ' be deleted after the Github change has been made.' +
                ' The full deletion process should be completed in [X time].';

            const that = this;
            this.$bvModal.msgBoxOk( message, {
                centered : true,
                title    : 'Deletion has been queued',
            } ).then(
                function () {
                    that.refreshTableItems();

                    that.$refs.table.refresh();
                },
            );
        },
        customFilter( row, filterProp ) {
            for ( const filter in filterProp ) {
                const filterValue = filterProp[ filter ];

                if ( filterValue && ! row[ filter ].toLowerCase().includes( filterProp[ filter ] ) ) {
                    return false;
                }
            }

            return true;
        },
        getItems() {
            const items = [];

            Object.keys( this.inProcessFindingAids ).forEach( repositoryCode => {
                if ( this.currentRepositories.includes( repositoryCode ) ) {
                    const findingAids = this.inProcessFindingAids[ repositoryCode ];

                    Object.keys( findingAids ).forEach( id => {
                        const findingAid = findingAids[ id ];

                        items.push(
                            {
                                repository     : `${ this.repositories[ repositoryCode ].name } ( ${ repositoryCode } )`,
                                repositoryCode : repositoryCode,
                                id             : id,
                                title          : findingAid.title,
                                datetime       : findingAid.datetime,
                            },
                        );
                    } );
                }
            } );

            return items;
        },
        onFiltered( filteredItems ) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length;
            this.currentPage = 1;
        },
        ...mapActions(
            [
                'setHelpModal',
                'addInProcessFindingAid',
                'deleteInProcessFindingAid',
            ],
        ),
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .action-button {
        margin-bottom : 2%;
        margin-left   : 2%;
        margin-right  : 2%;
        margin-top    : 2%;
    }

    #controls-row {
        margin-bottom : 1%;
    }

    #header {
        margin-bottom : 3%;
        margin-top : 3%;
    }
</style>
