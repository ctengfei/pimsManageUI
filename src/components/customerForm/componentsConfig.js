export const CommonUserComponents = [{
        type: "input",
        name: "单行文本",
        icon: "el-icon-share",
        options: {
            width: "100%",
            placeholder: "请输入单行文本",
            defaultValue: "",
            required: false,
            clearable: false,
            maxlength: ""
        }
    },
    {
        type: "textarea",
        name: "多行行文本",
        icon: "el-icon-share",
        options: {
            width: "100%",
            rows: 2,
            placeholder: "请输入多行行文本",
            defaultValue: "",
            required: false,
            maxlength: ""
        }
    },
    {
        type: "radio",
        name: "单选框组",
        icon: "el-icon-share",
        options: {
            inline: "inline-block",
            valueData: [{
                    value: '选项1',
                    label: '选项1'
                },
                {
                    value: '选项2',
                    label: '选项2'
                }
            ],
            defaultValue: "",
            required: false
        }
    },
    {
        type: "checkbox",
        name: "多选框组",
        icon: "el-icon-share",
        options: {
            inline: "inline-block",
            valueData: [{
                    value: '选项1',
                    label: '选项1'
                },
                {
                    value: '选项2',
                    label: '选项2'
                }
            ],
            defaultValue: [],
            required: false
        }
    },
    {
        type: "inputNumber",
        name: "计数器",
        icon: "el-icon-share",
        options: {
            defaultValue: 0,
            min: 0,
            max: 100,
            required: false,
            position: ""
        }
    },
    {
        type: "select",
        name: "下拉框",
        icon: "el-icon-share",
        options: {
            width: "100%",
            required: false,
            defaultValue: "",
            clearable: false,
            valueData: [{
                    value: '选项1',
                    label: '选项1'
                },
                {
                    value: '选项2',
                    label: '选项2'
                }
            ],
        }
    },
    {

        type: "slider",
        name: "滑块",
        icon: "el-icon-share",
        options: {
            required: false,
            defaultValue: 0,
            min: 0,
            max: 100
        }
    },
    {
        type: "rate",
        name: "评分",
        icon: "el-icon-share",
        options: {
            required: false,
            defaultValue: 0,
            max: 5
        }
    },
    {
        type: "timePicker",
        name: "时间选择器",
        icon: "el-icon-share",
        options: {
            width: "100%",
            required: false,
            defaultValue: "",
            clearable: false,
        }
    },
    {
        type: "datePicker",
        name: "日期选择器",
        icon: "el-icon-share",
        options: {
            width: "100%",
            required: false,
            clearable: false,
            defaultValue: "",
            type: "date",
            valueFormat: "yyyy-MM-dd"
        }
    },
    {
        type: "text",
        name: "文字",
        icon: "el-icon-share",
        options: {
            nameDisabled: true,
            defaultValue: "默认文字",
            position: "",
            lineHeight: 25,
            size: 14,
            leftPadding: 0,
            color: "#000000",
            weight: '',
            style: '',
            indent:0
        }
    },
    {
        type: "divider",
        name: "分割线",
        icon: "el-icon-share",
        options: {
            nameDisabled: true,
            defaultValue: "",
            position: 'center'
        }
    },  
    // {
    //     type: "grid",
    //     name: "网格布局",
    //     icon: "el-icon-share",
    //     columns: [{
    //             span: 12,
    //             list: []
    //         },
    //         {
    //             span: 12,
    //             list: []
    //         }
    //     ],
    //     options: {
    //         gutter: 0,
    //         justify: "start",
    //         align: 'top'
    //     }
    // }
]