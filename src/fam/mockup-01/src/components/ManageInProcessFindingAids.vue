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

                <template v-slot:cell(repository)="row">
                    <div @click="row.toggleDetails">
                        {{ row.item.repository }}
                    </div>
                </template>

                <template v-slot:cell(id)="row">
                    <div @click="row.toggleDetails">
                        {{ row.item.id }}
                    </div>
                </template>

                <template v-slot:cell(title)="row">
                    <div @click="row.toggleDetails">
                        {{ row.item.title }}
                    </div>
                </template>

                <template v-slot:cell(timestamp)="row">
                    <div @click="row.toggleDetails">
                        {{ row.value }}
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
                            :to="{ name : 'preview', params : { type : 'finding-aid', repositoryCode : row.item.repositoryCode, id : row.item.id } }"
                            target="_blank"
                        >
                            View finding aid preview
                        </b-button>

                        <b-button
                            class="action-button"
                            :to="{ name : 'preview', params : { type : 'ead', repositoryCode : row.item.repositoryCode, id : row.item.id } }"
                            target="_blank"
                        >
                            View EAD file preview
                        </b-button>

                        <b-button
                            class="action-button"
                            :data-id="row.item.id"
                            :data-repository-code="row.item.repositoryCode"
                            :data-title="row.item.title"
                            @click="clickPublishInProcessFindingAid"
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
                            Delete in-process finding aid
                        </b-button>
                    </div>
                </template>
            </b-table>
        </b-container>

        <b-modal
            id="confirm-deletion-modal"
            header-text-variant="danger"
            size="lg"
            centered
            title="Confirm deletion"
            ok-title="Delete"
            ok-variant="danger"
            @cancel="cancelDeleteInProcessFindingAid"
            @ok="confirmDeleteInProcessFindingAid"
        >
            <p>
                Are you sure you wish to delete preview finding aid {{ findingAidToDelete.repositoryCode }}/{{ findingAidToDelete.id }}?
            </p>
            <p>This will delete the following:</p>
            <p></p>
            <ul>
                <li>
                    Preview finding aid: {{ previewFindingAidToDeleteFullURL }}
                </li>
                <li>
                    Preview EAD file: {{ previewEADFileToDeleteFullURL }}
                </li>
            </ul>
        </b-modal>

        <b-modal
            id="deletion-in-progress-modal"
            centered
            no-close-on-esc
            no-close-on-backdrop
            hide-footer
            hide-header-close
            title="Deleting in-process finding aid..."
        >
            <b-row>
                <b-col />
                <b-col align="center">
                    <b-spinner />
                </b-col>
                <b-col />
            </b-row>
        </b-modal>

        <b-modal
            id="confirm-publish-modal"
            header-text-variant="danger"
            size="lg"
            centered
            title="Confirm publication"
            ok-title="Publish"
            ok-variant="danger"
            @cancel="cancelPublishInProcessFindingAid"
            @ok="queuePublishInProcessFindingAid"
        >
            <p>
                Are you sure you wish to publish in-process finding aid
                {{ findingAidToPublish.repositoryCode }}/{{ findingAidToPublish.id }}?
            </p>
            <p>
                This will publish data to the following locations, overwriting whatever might already be there:
            </p>
            <p></p>
            <ul>
                <li>
                    Finding aid:
                    http://dlib.nyu.edu/findingaids/html/{{ findingAidToPublish.repositoryCode }}/{{ findingAidToPublish.id }}/
                </li>
                <li>
                    Public EAD file:
                    http://dlib.nyu.edu/findingaids/ead/{{ findingAidToPublish.repositoryCode }}/{{ findingAidToPublish.id }}.xml
                </li>
                <li>
                    Search data: https://specialcollections.library.nyu.edu/search/
                </li>
                <li>
                    Github EAD file:
                    https://github.com/NYULibraries/findingaids_eads/blob/master/{{ findingAidToPublish.repositoryCode }}/{{ findingAidToPublish.id }}.xml
                </li>
            </ul>
        </b-modal>

        <b-modal
            id="queuing-publish-modal"
            centered
            no-close-on-esc
            no-close-on-backdrop
            hide-footer
            hide-header-close
            title="Queueing for publication..."
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
                    key               : 'timestamp',
                    label             : 'Timestamp',
                    formatter         : ( timestamp ) => {
                        return moment( timestamp * 1000 ).format( 'M/D/YYYY h:mm a' );
                    },
                    sortable          : true,
                    sortDirection     : 'desc',
                    filterByFormatted : true,
                    class             : 'text-left text-nowrap',
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
            filterOn           : [ 'title' ],
            findingAidToDelete : {
                id             : null,
                repositoryCode : null,
            },
            findingAidToPublish : {
                id             : null,
                repositoryCode : null,
                title          : null,
            },
        };
    },
    computed   : {
        previewEADFileToDeleteFullURL() {
            return this.previewToDeleteFullURL( 'ead' );
        },
        previewFindingAidToDeleteFullURL() {
            return this.previewToDeleteFullURL( 'finding-aid' );
        },
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
                'inProcessFindingAids',
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

        this.refreshTableItems();

        this.totalRows = this.items.length;

        this.setHelpModal(
            {
                content : `Some things to try:

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
            <li>Timestamp</li>
        </ul>
    </li>
    <li>Select different per page options from the dropdown</li>
    <li>Navigate to different pages using page navigator buttons</li>
    <li>Expand the Actions row for one or more finding aids rows</li>
    <li>Expand the Actions row for a finding aid and click the "View finding aid preview" button</li>
    <li>Expand the Actions row for a finding aid and click the "View EAD file preview" button</li>
    <li>Expand the Actions row for a finding aid and click the "Publish finding aid" button</li>
    <li>Expand the Actions row for a finding aid and click the "Delete in-process finding aid" button</li>
</ul>
`,
                title   : 'Manage In-Process Finding Aids screen',
            },
        );
    },
    methods    : {
        cancelDeleteInProcessFindingAid() {
            this.clearDeleteInProcess();
        },
        cancelPublishInProcessFindingAid() {
            this.clearPublishInProcess();
        },
        clearDeleteInProcess() {
            this.findingAidToDelete.id = null;
            this.findingAidToDelete.repositoryCode = null;
        },
        clearPublishInProcess() {
            this.findingAidToPublish.id = null;
            this.findingAidToPublish.repositoryCode = null;
        },
        clickDeleteInProcessFindingAid( event ) {
            this.findingAidToDelete.id = event.currentTarget.dataset.id;
            this.findingAidToDelete.repositoryCode = event.currentTarget.dataset.repositoryCode;

            this.$bvModal.show( 'confirm-deletion-modal' );
        },
        clickPublishInProcessFindingAid( event ) {
            this.findingAidToPublish.id = event.currentTarget.dataset.id;
            this.findingAidToPublish.repositoryCode = event.currentTarget.dataset.repositoryCode;
            this.findingAidToPublish.title = event.currentTarget.dataset.title;

            this.$bvModal.show( 'confirm-publish-modal' );
        },
        // Vuex action of the same name.
        async confirmDeleteInProcessFindingAid() {
            this.$bvModal.show( 'deletion-in-progress-modal' );

            await this.$sleep( 1000 );

            this.$bvModal.hide( 'deletion-in-progress-modal' );

            this.deleteInProcessFindingAid(
                {
                    id         : this.findingAidToDelete.id,
                    repository : this.findingAidToDelete.repositoryCode,
                },
            );

            this.clearDeleteInProcess();

            const message =
                'The in-process finding aid has been deleted.';

            const that = this;
            this.$bvModal.msgBoxOk( message, {
                centered : true,
                title    : 'Deletion completed',
            } ).then(
                function () {
                    that.refreshTableItems();

                    that.$refs.table.refresh();
                },
            );
        },
        // Originally this was deleteInProcessFindingAid, which conflicts with
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
                if ( this.currentRepositoryCodes.includes( repositoryCode ) ) {
                    const findingAids = this.inProcessFindingAids[ repositoryCode ];

                    Object.keys( findingAids ).forEach( id => {
                        const findingAid = findingAids[ id ];

                        items.push(
                            {
                                repository     : `${ this.repositories[ repositoryCode ].name } (${ repositoryCode })`,
                                repositoryCode : repositoryCode,
                                id             : id,
                                title          : findingAid.title,
                                timestamp       : findingAid.timestamp,
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
        previewToDeleteFullURL( type ) {
            return window.location.href.replace( '/#/in-process', '' ) +
                   '/' +
                   this.$router.resolve(
                       {
                           name   : 'preview',
                           params : {
                               type           : type,
                               repositoryCode : this.findingAidToDelete.repositoryCode,
                               id             : this.findingAidToDelete.id,
                           },
                       },
                   ).href;
        },
        async queuePublishInProcessFindingAid() {
            this.$bvModal.show( 'queuing-publish-modal' );

            await this.$sleep( 1000 );

            this.$bvModal.hide( 'queuing-publish-modal' );

            this.publishInProcessFindingAid(
                {
                    timestamp   : Math.round( ( new Date() ).getTime() / 1000 ),
                    id         : this.findingAidToPublish.id,
                    repository : this.findingAidToPublish.repositoryCode,
                    title      : this.findingAidToPublish.title,
                },
            );

            this.deleteInProcessFindingAid(
                {
                    id         : this.findingAidToPublish.id,
                    repository : this.findingAidToPublish.repositoryCode,
                },
            );

            this.clearPublishInProcess();

            const message =
                'The finding aid has been queued for publication.' +
                ' The finding aid, public EAD file, and search data will' +
                ' be published after the Github change has been made.' +
                ' The full publication process should be completed in [X time].';

            const that = this;
            this.$bvModal.msgBoxOk( message, {
                centered : true,
                title    : 'Publication has been queued',
            } ).then(
                function () {
                    that.refreshTableItems();

                    that.$refs.table.refresh();
                },
            );
        },
        refreshTableItems() {
            this.items = this.getItems();
        },
        ...mapActions(
            [
                'setHelpModal',
                'addInProcessFindingAid',
                'deleteInProcessFindingAid',
                'publishInProcessFindingAid',
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
