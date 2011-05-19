var fu = (function() {
    return {
        config: {
            cache: {
                logEnabled:true,
                expirationSeconds:600,
                sweepIntervalSeconds:60
            }
        }
    };
})();

Ti.include(
        '/tifu/config/config.js',
        '/tifu/lib/lib.js',
        '/tifu/ui/ui.js',
        '/tifu/model/model.js',
        '/tifu/orchestrator/orchestrator.js'
);