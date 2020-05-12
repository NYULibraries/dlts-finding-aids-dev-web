<template>
    <div>
        <b-container
            id="main-container"
            class="main-container h-100"
        >
            <navbar />

            <h1 id="header">
                Upload EAD XML file
            </h1>

            <b-row
                id="upload-row"
                class="row"
                align-h="center"
            >
                <b-col
                    id="upload-col"
                    cols="6"
                >
                    <!-- Styled -->
                    <b-form-file
                        ref="upload-file-input"
                        v-model="file"
                        :state="state"
                        accept=".xml"
                        placeholder="Choose an EAD file or drop it here..."
                        drop-placeholder="Drop file here..."
                    />
                </b-col>
            </b-row>

            <b-row
                id="results-row"
                class="row"
                align-h="center"
            >
                <b-col
                    id="results-col"
                >
                    <b-form-textarea
                        id="results-textarea"
                        v-model="results"
                        placeholder="Waiting for upload of EAD file..."
                        rows="20"
                        readonly
                        plaintext
                    />
                </b-col>
            </b-row>

            <b-row
                id="buttons-row"
                class="row"
                align-h="center"
            >
                <b-col
                    id="buttons-col"
                    cols="10"
                >
                    <b-button
                        id="cancel-button"
                        class="button"
                        variant="dark"
                        @click="cancel"
                    >
                        Cancel
                    </b-button>
                    <b-button
                        id="submit-button"
                        class="button"
                        variant="success"
                        :disabled="submitDisabled"
                        @click="submit"
                    >
                        Submit
                    </b-button>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import moment from 'moment';
import { mapActions, mapGetters } from 'vuex';

import Navbar from './Navbar';

let parser;

export default {
    name       : 'CreateNewFindingAid',
    components : {
        Navbar,
    },
    data() {
        return {
            file                      : null,
            inProcessFindingAid       : null,
            results                   : null,
            state                     : null,
            submitDisabled            : true,
        };
    },
    computed : {
        recognizedRepositoryNames() {
            return Object.keys( this.repositories ).map( repositoryCode => {
                return this.repositories[ repositoryCode ].name;
            } );
        },
        recognizedRepositoryNamesListHTML() {
            return this.recognizedRepositoryNames.map( repositoryName => {
                return `<li>${ repositoryName }</li>\n`;
            } ).join( '' );
        },
        ...mapGetters(
            [
                'currentUser',
                'currentRepositoryNames',
                'repositories',
            ],
        ),
    },
    watch : {
        async file() {
            if ( ! this.file.name.endsWith( '.xml' ) ) {
                this.results = 'The uploaded EAD file must have a .xml extension.';
                this.state = false;
                return;
            }

            this.state = true;
            this.results = `Uploading EAD file ${ this.file.name }...\n`;
            await this.$sleep( 5000 );
            this.results += 'Upload complete.\n';

            const ead = await this.$readFileAsTextSync( this.file );

            this.processEAD( ead );

            // Need to do this so that users can re-upload same file in Chrome
            this.$refs[ 'upload-file-input' ].reset();
        },
    },
    mounted() {
        if ( ! this.currentUser ) {
            this.$router.push( { name : 'login' } );

            return;
        }

        parser = new DOMParser();

        this.setHelpModal(
            {
                content : `This mockup will accept uploads of EAD files with this
(obviously fake) structure:

<br>
<br>

<code>
&lt;ead&gt;<br />
&nbsp;&nbsp; &nbsp; &nbsp; &nbsp;&lt;eadid&gt;abc_123_def456&lt;/eadid&gt;<br />
&nbsp;&nbsp; &nbsp; &nbsp; &nbsp;&lt;title&gt;New finding aid&lt;/title&gt;<br />
&nbsp;&nbsp; &nbsp; &nbsp; &nbsp;&lt;repository&gt;New York University Archives&lt;/repository&gt;<br />
&lt;/ead&gt;
</code>

<br>
<br>

Some things to try:

<br>
<br>

<ul>
    <li>Upload a file with valid content using a filename ending in .xml</li>
    <li>Upload a file with valid content using a filename that does not end in .xml</li>
    <li>Upload a file with that is missing one or more of the elements shown in the example above</li>
    <li>Upload a file with one or more elements with empty values</li>
    <li>
        Upload a file with an &lt;eadid&gt; that does not conform to the
        <a
            href="https://jira.nyu.edu/jira/browse/FADESIGN-20?focusedCommentId=426301&page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-426301"
            target="_blank">
            rules
        </a>
    </li>
    <li>
        Upload a file with a &lt;repository&gt; long name for a repository that
        the current user is not authorized for in the FAM (note that user
        weatherly@nyu.edu is authorized to manage all repositories)
    </li>
    <li>
        Upload a file with a &lt;repository&gt; value that is not a recognized.
        These are the currently recognized repository long names:
        <ul>
            ${ this.recognizedRepositoryNamesListHTML }
        </ul>
    </li>
    <li>Click the Cancel button after an upload has completed, but before submitting using the Submit button</li>
    <li>Upload a valid EAD file and submit it using the Submit button</li>
</ul>
`,
                title   : 'Create New Finding Aid screen',
            },
        );
    },
    methods : {
        cancel() {
            this.file = null;
            this.results = null;
            this.state = true;
            this.submitDisabled = true;
        },
        getEADElementValue( eadDoc, elementName ) {
            const element = eadDoc.getElementsByTagName( elementName )[ 0 ];

            let elementValue;
            if ( element ) {
                elementValue = element.textContent.trim();

                if ( ! elementValue ) {
                    throw new Error( `Required element <${ elementName }> is empty.` );
                }

                return elementValue;
            } else {
                throw new Error( `Required element <${ elementName }> not found.` );
            }
        },
        getRepositoryCodeForRepository( repositoryName ) {
            var that = this,
                repositoryCode;

            Object.keys( this.repositories ).forEach( code => {
                if ( that.repositories[ code ].name === repositoryName ) {
                    repositoryCode = code;
                }
            } );

            return repositoryCode;
        },
        processEAD( ead ) {
            let abort = false;
            const uploadedFindingAid = {};

            const eadDoc = parser.parseFromString( ead, 'application/xml' );

            const parserErrorCount = eadDoc.documentElement
                .getElementsByTagName( 'parsererror' ).length;

            if ( parserErrorCount > 0 ) {
                this.results += 'The XML in this file is not valid.  Please check it ' +
                                'using an XML validator.';
                return;
            }

            const requiredEADElements = [ 'eadid', 'repository', 'title' ];
            requiredEADElements.forEach( elementName => {
                try {
                    uploadedFindingAid[ elementName ] = this.getEADElementValue( eadDoc, elementName );
                } catch( e ) {
                    this.results += `${ e }\n`;

                    abort = true;
                }
            } );

            if ( uploadedFindingAid.repository ) {
                if ( this.recognizedRepositoryNames.includes( uploadedFindingAid.repository ) ) {
                    if ( ! this.currentRepositoryNames.includes( uploadedFindingAid.repository ) ) {
                        this.results += `User ${ this.currentUser } is not currently authorized` +
                                        ` to create a finding aid for repository "${ uploadedFindingAid.repository }".\n`;

                        abort = true;
                    }
                } else {
                    this.results += `Element <repository> contains unknown repository name "${ uploadedFindingAid.repository }".
The repository name must match a value from this list:

${ this.recognizedRepositoryNames.join( '\n' ) }

`;

                    abort = true;
                }
            }

            const eadidErrors = this.validateEADID( uploadedFindingAid.eadid );
            if ( eadidErrors.length > 0 ) {
                this.results += `<eadid> value "${ uploadedFindingAid.eadid }" does ` +
                    'not conform to the Finding Aids specification.\n';

                this.results += eadidErrors.join( '\n' ) + '\n';

                abort = true;
            }

            if ( abort ) {
                this.results += 'Please make the necessary corrections and re-upload the EAD file.';
                this.state = false;
                this.submitDisabled = true;

                return;
            }

            this.newInProcessFindingAid = {
                datetime   : Math.round( ( new Date() ).getTime() / 1000 ),
                id         : uploadedFindingAid.eadid,
                repository : this.getRepositoryCodeForRepository( uploadedFindingAid.repository ),
                title      : uploadedFindingAid.title,
            };

            this.results += 'EAD file has been validated.\nReady to submit:\n\n' +
                `EAD ID: ${ uploadedFindingAid.eadid }\n` +
                `TITLE: ${ uploadedFindingAid.title }\n` +
                `REPOSITORY: ${ uploadedFindingAid.repository }` +
                '\n\n';

            this.results += 'Proceed to In-process FAs to preview the new EAD file and finding aid.\n';

            this.submitDisabled = false;
        },
        async submit() {
            this.results += 'Creating in-process finding aid...\n';

            await this.$sleep( 5000 );

            this.addInProcessFindingAid( this.newInProcessFindingAid );

            const formattedDatetime =
                moment( this.newInProcessFindingAid.datetime * 1000 ).format( 'M/D/YYYY h:mm a' );

            this.results += 'New in-process finding aid created:\n\n' +
                `ID: ${ this.newInProcessFindingAid.id }\n` +
                `TITLE: ${ this.newInProcessFindingAid.title }\n` +
                `REPOSITORY CODE: ${ this.newInProcessFindingAid.repository }\n` +
                `DATETIME: ${  formattedDatetime }\n`;

            this.submitDisabled = true;
        },
        validateEADID( eadid ) {
            const errors = [];

            const tokens = eadid.split( '_' );
            if ( tokens.length < 2 || tokens.length > 8 ) {
                errors.push( 'There must be between 2 to 8 character groups joined by underscores.' );
            }

            const allowedCharactersRegex = /[^a-z0-9]/g;
            const disallowedCharactersFoundObject = {};
            tokens.forEach( token => {
                const matches = [ ...token.matchAll( allowedCharactersRegex ) ];

                if ( matches.length > 0 ) {
                    matches.forEach( match => {
                        disallowedCharactersFoundObject[ match ] = true;
                    } );
                }
            } );

            const disallowedCharactersFound = Object.keys( disallowedCharactersFoundObject );
            if ( disallowedCharactersFound.length > 0 ) {
                errors.push( 'The following characters are not allowed in character groups: ' +
                             disallowedCharactersFound.sort().join( ', ' ) );
            }

            return errors;
        },
        ...mapActions(
            [
                'addInProcessFindingAid',
                'setHelpModal',
            ],
        ),
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
    border : solid black 1px;
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
