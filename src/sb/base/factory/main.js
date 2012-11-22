define(
        'sb/base/factory/main',
        [
                'sb/base/factory/SimpleBinding',
                'sb/base/factory/Factory',
                'sb/base/factory/FactoryOptions'
        ],
        function(SimpleBinding, Factory, FactoryOptions) { 
               return {
                       SimpleBinding: SimpleBinding,
                       Factory: Factory,
                       FactoryOptions: FactoryOptions
               }; 
        }
);
