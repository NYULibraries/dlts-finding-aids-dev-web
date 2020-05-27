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
                dark
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

                <template v-slot:cell(title)="row">
                    <div @click="row.toggleDetails">
                        {{ row.item.title }}
                    </div>
                </template>

                <template v-slot:cell(actions)="row">
                    <span
                        ref="toggle-details-span"
                        class="h1"
                    >
                        <b-icon
                            v-if="row.detailsShowing"
                            icon="caret-down-fill"
                            @click="row.toggleDetails"
                        />
                        <b-icon
                            v-else
                            icon="caret-right-fill"
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
                            View finding aid
                        </b-button>

                        <b-button
                            class="action-button"
                            :href="`http://dlib.nyu.edu/findingaids/ead/${ row.item.repositoryCode }/${ row.item.id }.xml`"
                            target="_blank"
                        >
                            View EAD file
                        </b-button>

                        <b-button
                            class="action-button"
                            :data-id="row.item.id"
                            :data-repository-code="row.item.repositoryCode"
                            variant="danger"
                            @click="clickUnpublishFindingAid"
                        >
                            Unpublish finding aid
                        </b-button>
                    </div>
                </template>
            </b-table>
        </b-container>

        <b-modal
            id="load-table-items-modal"
            size="lg"
            centered
            title="Fetching the latest EAD files metadata from the Github repo"
            hide-footer
        >
            <b-row>
                <b-col>
                    <div id="load-table-items-modal-progress-message">
                        <div
                            v-for="loadingRepositoryCode in loadingRepositoryCodes"
                            :key="loadingRepositoryCode"
                        >
                            Fetching Github EAD files snapshot for {{ loadingRepositoryCode }} repository <b-spinner />
                        </div>
                        <br>
                        <ul>
                            <li
                                v-for="loadedRepositoryCode in loadedRepositoryCodes"
                                :key="loadedRepositoryCode"
                            >
                                {{ loadedRepositoryCode }}: {{ getNumFindingAidsForRepositoryCode( loadedRepositoryCode ) }} EAD files
                            </li>
                        </ul>
                    </div>
                </b-col>
            </b-row>
        </b-modal>

        <b-modal
            id="confirm-unpublish-modal"
            header-text-variant="danger"
            size="lg"
            centered
            title="Confirm deletion"
            ok-title="Delete"
            ok-variant="danger"
            @cancel="cancelUnpublishFindingAid"
            @ok="queueUnpublishFindingAid"
        >
            <p>Are you sure you wish to unpublish {{ findingAidToUnpublish.repositoryCode }}/{{ findingAidToUnpublish.id }}?</p>
            <p>This will delete the following:</p>
            <p></p>
            <ul>
                <li>
                    Finding aid: http://dlib.nyu.edu/findingaids/html/{{ findingAidToUnpublish.repositoryCode }}/{{ findingAidToUnpublish.id }}/
                </li>
                <li>
                    Public EAD file: http://dlib.nyu.edu/findingaids/ead/{{ findingAidToUnpublish.repositoryCode }}/{{ findingAidToUnpublish.id }}.xml
                </li>
                <li>
                    Search data: https://specialcollections.library.nyu.edu/search/
                </li>
                <li>
                    Github EAD file:
                    https://github.com/NYULibraries/findingaids_eads/blob/master/{{ findingAidToUnpublish.repositoryCode }}/{{ findingAidToUnpublish.id }}.xml
                </li>
            </ul>
        </b-modal>

        <b-modal
            id="queuing-unpublish-modal"
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
    name       : 'ManagePublishedFindingAids',
    components : {
        Navbar,
    },
    data() {
        return {
            currentPage            : 1,
            fields                 : [
                {
                    key   : 'actions',
                    label : '',
                    class : 'text-left text-nowrap',
                },
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
            ],
            filter                 : {
                id         : null,
                repository : null,
                title      : null,
            },
            filterOn               : [ 'title' ],
            findingAidToUnpublish  : {
                id             : null,
                repositoryCode : null,
            },
            items                  : null,
            loadedRepositoryCodes  : [],
            loadingRepositoryCodes : [],
            pageOptions            : [ 10, 25, 50, 100 ],
            perPage                : 10,
            sortBy                 : 'repository',
            sortDirection          : 'asc',
            totalRows              : 0,
        };
    },
    computed   : {
        repositoryFilterOptions() {
            const options = this.currentRepositoryCodes.map( repositoryCode => {
                return {
                    // Filter matches against repository, which has repositoryCode
                    // in parentheses at the end.
                    value : `(${ repositoryCode })`,
                    text  : repositoryCode,
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
                'currentRepositoryCodes',
                'currentUser',
                'fetchInitialPublishedFindingAidsMetadata',
                'publishedFindingAids',
                'repositories',
            ],
        ),
    },
    watch      : {},
    mounted() {
        if ( ! this.currentUser ) {
            this.$router.push( { name : 'login' } );

            return;
        }

        if ( this.fetchInitialPublishedFindingAidsMetadata ) {
            this.refreshTableItemsFromServer();

            this.setFetchInitialPublishedFindingAidsMetadata( false );
        } else {
            this.refreshTableItemsFromStore();
        }

        this.totalRows = this.items.length;

        this.setHelpModal(
            {
                content : `
<p>
The first time the user navigates to <strong>Published FAs</strong>, the FAM will
fetch the latest files metadata snapshots from the Github repo in order to populate
the finding aids table.  This is done on the initial visit to this page only.
Subsequently navigating to another screen and then returning to this one will not
trigger a refresh of the data in the table.
</p>

Some things to try:

<br>
<br>

<ul>
    <li>Filter by:
        <ul>
            <li>Repository</li>
            <li>ID</li>
            <li>Title</li>
        </ul>
    </li>
    <li>Sort (ascending and descending) by:
        <ul>
            <li>Repository</li>
            <li>ID</li>
            <li>Title</li>
            <li>Datetime</li>
        </ul>
    </li>
    <li>Select different per page options from the dropdown</li>
    <li>Navigate to different pages using page navigator buttons</li>
    <li>Expand the Actions row for one or more finding aids rows</li>
    <li>Expand the Actions row for a finding aid and click the "View finding aid" button</li>
    <li>Expand the Actions row for a finding aid and click the "View EAD file" button</li>
    <li>Expand the Actions row for a finding aid and click the "Unpublish finding aid" button</li>
</ul>
`,
                title   : 'Manage Published Finding Aids screen',
            },
        );
    },
    methods    : {
        cancelUnpublishFindingAid() {
            this.clearUnpublish();
        },
        clearUnpublish() {
            this.findingAidToUnpublish.id = null;
            this.findingAidToUnpublish.repositoryCode = null;
        },
        clickUnpublishFindingAid( event ) {
            this.findingAidToUnpublish.id = event.currentTarget.dataset.id;
            this.findingAidToUnpublish.repositoryCode = event.currentTarget.dataset.repositoryCode;

            this.$bvModal.show( 'confirm-unpublish-modal' );
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

            Object.keys( this.publishedFindingAids ).forEach( repositoryCode => {
                if ( this.currentRepositoryCodes.includes( repositoryCode ) ) {
                    const findingAids = this.publishedFindingAids[ repositoryCode ];

                    Object.keys( findingAids ).forEach( id => {
                        const findingAid = findingAids[ id ];

                        items.push(
                            {
                                repository     : `${ this.repositories[ repositoryCode ].name } (${ repositoryCode })`,
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
        getNumFindingAidsForRepositoryCode( repositoryCode ) {
            if ( this.publishedFindingAids[ repositoryCode ] ) {
                return Object.keys( this.publishedFindingAids[ repositoryCode ] )
                    .length.toLocaleString();
            } else {
                return 0;
            }
        },
        onFiltered( filteredItems ) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length;
            this.currentPage = 1;
        },
        async queueUnpublishFindingAid() {
            this.$bvModal.show( 'queuing-unpublish-modal' );

            await this.$sleep( 1000 );

            this.$bvModal.hide( 'queuing-unpublish-modal' );

            this.unpublishFindingAid(
                {
                    id         : this.findingAidToUnpublish.id,
                    repository : this.findingAidToUnpublish.repositoryCode,
                },
            );

            this.clearUnpublish();

            const message =
                'The Github EAD file has been queued for deletion.' +
                ' The finding aid, public EAD file, and search data will' +
                ' be deleted after the Github change has been made.' +
                ' The full unpublish process should be completed in [X time].';

            const that = this;
            this.$bvModal.msgBoxOk( message, {
                centered : true,
                title    : 'Deletion has been queued',
            } ).then(
                function () {
                    that.refreshTableItemsFromStore();

                    that.$refs.table.refresh();
                },
            );
        },
        async refreshTableItemsFromServer() {
            this.$bvModal.show( 'load-table-items-modal' );

            const numCurrentRepositoryCodes = this.currentRepositoryCodes.length;
            for ( let i = 0; i < numCurrentRepositoryCodes; i++ ) {
                const repositoryCode = this.currentRepositoryCodes[ i ];

                this.loadingRepositoryCodes.push( repositoryCode );

                await this.$sleep( this.repositories[ repositoryCode ].loadTime );

                this.loadingRepositoryCodes.splice(
                    this.loadingRepositoryCodes.indexOf( repositoryCode ),
                    1,
                );

                this.loadedRepositoryCodes.push( repositoryCode );
            }

            this.items = this.getItems();
        },
        refreshTableItemsFromStore() {
            this.items = this.getItems();
        },
        ...mapActions(
            [
                'setHelpModal',
                'setFetchInitialPublishedFindingAidsMetadata',
                'unpublishFindingAid',
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
