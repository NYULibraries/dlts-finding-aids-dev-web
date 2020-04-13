async function readFileAsTextSync( file ) {
    const text = await new Promise( ( resolve ) => {
        const fileReader = new FileReader();
        fileReader.onload = ( e ) => resolve( fileReader.result );
        fileReader.readAsText( file );
    } );

    return text;
}

function sleep( milliseconds ) {
    return new Promise( resolve => setTimeout( resolve, milliseconds ) );
};

export default {
    install( Vue, options ) {
        Vue.prototype.$readFileAsTextSync = readFileAsTextSync;
        Vue.prototype.$sleep = sleep;
    },
};
