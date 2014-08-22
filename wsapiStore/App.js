Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    items:{ html:'<a href="https://help.rallydev.com/apps/2.0rc3/doc/#!/example/simple-grid">Simple Grid</a>'},
    launch: function() {
        var currentProject = this.getContext().getProject().ObjectID;
        console.log(currentProject);
        var filters = Ext.create('Rally.data.QueryFilter', {
            property: 'Requirement.Project.ObjectID',
            operator: '!=',
            value: currentProject
        });
        
        filters = filters.or({
            property: 'Requirement',
            operator: '=',
            value: null  
        });
        filters.toString();

        this.add({
            xtype: 'rallygrid',
            columnCfgs: [
                'FormattedID',
                'Name',
                'Requirement'
            ],
            context: this.getContext(),
            enableEditing: false,
            showRowActionsColumn: false,
            storeConfig: {
                model: 'defect',
                filters: [filters]
            }
        });
    }
});