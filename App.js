Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    items:{ html:'<a href="https://help.rallydev.com/apps/2.0rc3/doc/">App SDK 2.0rc3 Docs</a>'},
    launch: function() {
        this.records = [];
        var defects = Ext.create('Rally.data.wsapi.Store', {
            model: 'defect',
            autoLoad: true,
            filters: [
                {
                    property: 'Requirement',
                    operator: '=',
                    value: null 
                }
            ],
            fetch: ['FormattedID', 'Name', 'Requirement']
        });
        defects.load().then({
            success: this.loadMoreDefects,
            scope: this
        }).then({
            success: this.makeGrid,
            scope: this
        }).then({
            success: function() {
                //great success!
            },
            failure: function(error) {
                //oh noes!
            }
        });
    },
    
    loadMoreDefects: function(defects){
        this.records.push(defects);
        var currentProject = this.getContext().getProject().ObjectID;
        console.log(currentProject);
        var moreDefects = Ext.create('Rally.data.wsapi.Store', {
            model: 'defect',
            autoLoad: true,
            filters: [
            {
                property: 'Requirement.Project.ObjectID',
                operator: '!=',
                value: currentProject 
            }
            ],
            fetch: ['FormattedID', 'Name', 'Requirement']
        });
        return moreDefects.load();
    },
            
    makeGrid: function(moreDefects) {
        var that = this;
        that.records.push(moreDefects);
        that.records = _.flatten(that.records);
        console.log(that.records);
        
        this.add({
            xtype: 'rallygrid',
            showPagingToolbar: false,
            showRowActionsColumn: false,
            editable: false,
            store: Ext.create('Rally.data.custom.Store', {
                data: that.records
            }),
            columnCfgs: [
                {
                    xtype: 'templatecolumn',
                    text: 'ID',
                    dataIndex: 'FormattedID',
                    width: 100,
                    tpl: Ext.create('Rally.ui.renderer.template.FormattedIDTemplate')
                },
                {
                    text: 'Name',
                    dataIndex: 'Name',
                    flex: 1
                },
                {
                    text: 'Requirement',
                    dataIndex: 'Requirement',
                     renderer: function(value) {
                        if (value) {
                            return value._refObjectName
                        }
                        else{
                            return 'None'
                        }
                        
                    }
                }
            ]
        });
       
    }
});
