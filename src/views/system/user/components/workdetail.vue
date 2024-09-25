<template>
  <div>
    <div class="leftInfo">
      <div class="flexboxs">
        <span style="font-size:16px;">{{parentData.code}}</span>
        <span class="flexbox ml20">
          <template>
            <div v-if="parentData.status == 'todo'">
              <div class="status allocated">
                <div>待处理</div>
              </div>
            </div>
            <div v-else-if="parentData.status == 'doing'">
              <div class="status handle">
                <div>处理中</div>
              </div>
            </div>
            <div v-else-if="parentData.status == 'cancel'">
              <div class="status cancel">
                <div>已取消</div>
              </div>
            </div>
            <div v-else-if="parentData.status =='done'">
              <div class="status success">
                <div>已完成</div>
              </div>
            </div>
          </template>
        </span>
      </div>
      <el-divider></el-divider>
      <el-row>
        <el-form label-width="80px" class="basicInfos">
          <div class="el-descriptions__title mb20">工单信息</div>
          <el-col :span="12">
            <el-form-item label="工单类型">
              <el-select v-model="parentData.type" disabled>
                <el-option
                  v-for="item in repair_work_order_type"
                  :key="item.value"
                  :value="item.value"
                  :label="item.name"
                >{{item.name}}
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报修分类">
              <el-input v-model="parentData.repairType" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="位置信息">
              <el-input v-model="parentData.location" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="描述信息">
              <el-input type="textarea" :rows="2" v-model="parentData.content" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="附件信息" v-if="detail.mediaMeta">
              <i class="el-icon-picture" @click="bigImage(itemchild.img)"
                  v-for="(itemchild,index) in detail.mediaMeta.pictures" style="font-size:36px;line-height: 36px" :key="index"></i>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-row>
        <el-form label-width="80px" class="basicInfos infos">
          <div class="el-descriptions__title mb20">提单信息</div>
          <el-col>
            <el-form-item label="提单人">
              <el-input v-model="create.creatorName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="联系方式">
              <el-input v-model="create.creatorPhone" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="提交时间">
              <el-input v-model="create.createTime" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-row>
        <el-form label-width="80px" class="basicInfos infos">
          <div class="el-descriptions__title mb20">受理人信息</div>
          <el-col>
            <el-form-item label="受理人员">
              <el-input v-model="accept.processorName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="手机号码">
              <el-input v-model="accept.processorPhone" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="受理时间">
              <el-input v-model="accept.acceptTime" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <div class="rightInfo">
      <div class="el-descriptions__title mb20">工单信息</div>
      <div class="stepss">
        <div class="steps_item" v-for="(i, index) in recordData" :key="index">
          <div class="s_m">
            <p>{{i.createTime.split(' ')[0]}}</p>
            <p>{{i.createTime.split(' ')[1]}}</p>
          </div>
          <div class="s_r">
            <div class="line" :style="{borderColor:index != 0?borderColor:'rgba(0,0,0,0)'}"></div>
            <div class="lines">
              <div class="circle">
                <div class="dot" v-if="index==0" :class="{active:i.active}"></div>
                <!-- 圆点 -->
                <div class="dot" v-if="index!=0 && index != cunindex"></div>
                <div class="dot" v-if="index == cunindex"></div>
              </div>
            </div>
            <div class="line" :style="{borderColor:index != recordData.length-1?borderColor:'rgba(0,0,0,0)'}"></div>
          </div>
          <div class="s_l">
            <div class="info_item">
              <div class="titleStatus">
                <span class="title">{{ i.title }}</span>
                <div v-if="i.workOrderStatus=='已评价'" class="title evaluatedStatus">{{i.workOrderStatus}}</div>
                <div v-if="i.workOrderStatus=='待处理'" class="title handleStatus">{{i.workOrderStatus}}</div>
                <div v-if="i.workOrderStatus=='处理中'" class="title waitStatus">{{i.workOrderStatus}}</div>
                <div v-if="i.workOrderStatus=='已完成'" class="title finishStatus">{{i.workOrderStatus}}</div>
                <div v-if="i.workOrderStatus=='取消'" class="title cancelStatus">{{i.workOrderStatus}}</div>
              </div>
              <div :style="{WebkitLineClamp:lineNum!=0?lineNum:''}" v-for="(item,index) in i.contentInfo" :key="index">
                {{ item.name}}：{{ item.value }}
              </div>
              <div :style="{WebkitLineClamp:lineNum!=0?lineNum:''}" class="stars" v-if="i.stars>0">评价星级：
                <el-rate v-model="i.stars" disabled></el-rate>
              </div>
              <div class="contents" v-if="i.mediaMeta">
                上传附件：
                <i class="el-icon-picture" :class="item.img&&item.img.indexOf('data:image/svg+xml')!=-1?'bgc':''"
                    @click="bigImage(item.img)"
                    v-for="(item,index) in i.mediaMeta.pictures" style="font-size:36px;line-height: 36px" :key="index"></i>
                <i class="el-icon-video-camera-solid" 
                    @click="bigImage(item.video)" v-for="(item,index) in i.mediaMeta.videos"
                    style="font-size:36px;line-height: 36px" :key="index"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="工单反馈"
      :visible.sync="feedbackShow"
      width="30%"
    >
      <el-row>
        <el-form :model="feedbackForm" label-width="80px" :rules="feedbackrules" ref="form">
          <el-col :span="12">
            <el-form-item label="工单编号">
              <el-input v-model="feedbackForm.orderCode" disabled/>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="反馈内容" prop="result">
              <el-input type="textarea" :rows="3" v-model="feedbackForm.result" placeholder="请输入反馈内容"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer">
        <el-button type="primary" @click="onfeedback()">确定</el-button>
        <el-button plain @click="cancel()">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="附件信息"
      :visible.sync="BigImgShow"
      append-to-body
      width="40%"
    >
      <div style="text-align:center;">
        <img :src="bigSrc" alt="" class="imgs" v-if="bigSrc.indexOf('data:img/jpg')!=-1">
        <video :src="bigSrc" class="imgs" v-else controls></video>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import pagination from '@/components/comPagination'
  import {searchWorkorderById, getPhoto, feedback} from '@/api/smartProperty/workManagement'

  export default {
    name: 'WorkDetail',
    components: {
      pagination,
    },
    props: {
      rowData: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    data() {
      return {
        lineNum: 1,
        borderColor: '#afb9d0',
        color: '#fff',
        cunindex: '',
        parentData: {},
        recordData: [],
        total: 10,
        pageSize: 5,
        pageNum: 1,
        feedbackShow: false,
        feedbackForm: {
          orderCode: "",
          result: "",
        },
        repair_work_order_type: [
          {
            value: "enterprise",
            name: "企业报修"
          },
          {
            value: "public",
            name: "公共报修"
          }
        ],
        accept: {},
        create: {},
        feedbackrules: {
          result: [
            {required: true, message: '请输入反馈内容', trigger: 'blur'}
          ],
        },
        detail: {},
        BigImgShow: false,
        bigSrc: '',
      }
    },
    mounted() {
      this.parentData = this.rowData;
      this.getWorkOrderById();
      this.cunindex = this.recordData.length - 1;
      this.checktype();
    },
    methods: {
      bigImage(data) {
        this.BigImgShow = true;
        this.bigSrc = data;
      },
      checktype() {
        for (let key  in this.parentData) {
          if (key == 'type') {
            if (this.parentData[key] != "") {
              let newarr = this.repair_work_order_type.filter(item => {
                return item.value == this.parentData[key];
              });

            }
          }
        }
      },
      onCancel() {
        this.$emit('workDetailVisibleShow', true);
      },
      getWorkOrderById() {
        let obj = {url: "/pm/repair/order/query/{id}", method: "GET"};
        let id = this.parentData.id;
        searchWorkorderById(obj.url, obj.method, id).then(res => {
            this.detail = res.data;
            this.recordData = res.data.records;
            this.accept = res.data;
            this.create = res.data;
            if (res.data.mediaMeta && res.data.mediaMeta.pictures.length > 0) {
              res.data.mediaMeta.pictures.map((item) => {
                this.setPhoto(item).then((val) => {
                  let img = `data:img/jpg;base64,${val.data}`;
                  this.$set(item, "img", img);
                });
              });
            }
            if (res.data.records) {
              res.data.records.map((items) => {
                if (items.mediaMeta) {
                  if (items.mediaMeta.pictures && items.mediaMeta.pictures.length > 0) {
                    items.mediaMeta.pictures.map((item) => {
                      this.setPhoto(item).then((val) => {
                        if (item.name != "签名") {
                          let img = `data:img/jpg;base64,${val.data}`;
                          this.$set(item, "img", img);
                        } else {
                          this.$set(item, "img", val.data);
                        }
                      });
                    });
                  }
                  if (items.mediaMeta.videos && items.mediaMeta.videos.length > 0) {
                    items.mediaMeta.videos.map((item) => {
                      this.setPhoto(item).then((val) => {
                        let video = `data:video/mp4;base64,${val.data}`;
                        this.$set(item, "video", video);
                      });
                    });
                  }
                }
              })
            }

          
        })
      },
      setPhoto(item) {
        let url = '';
        if (item.name == "签名") {
          url = '/pm/fastdfs/file/content';
        } else {
          url = '/pm/fastdfs/file/resource';
        }
        let method = 'get';
        let tempObj1 = {
          url,
          method,
          path: item.path
        };
        return new Promise(function (resolve, reject) {
          getPhoto(tempObj1).then((res) => {
            resolve(res);
          });
        });
      },
      handleCurrentChange() {

      },
      feedback() {
        this.feedbackForm.orderCode = this.parentData.code
        this.feedbackShow = true;
      },
      onfeedback() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            let obj = {url: "/pm/repair/order/feedback/process", method: "POST"};
            let data = this.feedbackForm;
            feedback(obj.url, obj.method, data).then(res => {
              if (res.code === 200) {
                this.$message.success("反馈成功");
                this.feedbackShow = false;
                this.feedbackForm.result = ''
                this.getWorkOrderById();
              } else {
                this.$message.error("反馈失败");
                this.feedbackForm.result = ''
              }
            })
          }
        })
      },
      cancel() {
        this.feedbackShow = false;
       this.feedbackForm.result = ''
      }
    }
  };
</script>

<style lang="scss" scoped>
  .flexboxs {
    width: 100% !important;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .circle {
    border: solid 3px gray;
    width: 20px;
    height: 20px;
    border-radius: 50%;

  }

  .circles {
    border: solid 3px #206aff;
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }

  p {
    margin: 0;
    padding: 0;
  }

  .status > div {
    width: 72px;
    height: 27px;
    line-height: 27px;
    font-size: 14px;
    font-weight: 400;
    border-radius: 3px;
    text-align: center;
  }

  .cancel {
    color: #909399;
    div {
      background-color: #909399;
      color: #000;
    }
    p {
      font-size: 12px;
      font-weight: 600;
    }
  }

  .success {
    color: #67C23A;
    div {
      background-color: #67C23A;
      color: #000;

    }
    p {
      font-size: 12px;
      font-weight: 600;
    }
  }

  .allocated {
    color: #409EFF;
    div {
      background-color: #409EFF;
      color: #000;

    }
    p {
      font-size: 12px;
      font-weight: 600;
    }
  }

  .handle {
    color: #E6A23C;
    div {
      background-color: #E6A23C;
      color: #000;

    }
    p {
      font-size: 12px;
      font-weight: 600;
    }
  }
  .leftInfo {
    .top {
      background-color: #202230;
      padding: 20px;
      border-radius: 8px;
    }
    .bottomInfo {
      margin-top: 10px;
      .left {
        background-color: #202230;
        padding: 20px;
        border-radius: 8px;
        width: 50%;
        float: left;
        height: 100%;
        overflow: auto;
      }
      .right {
        background-color: #202230;
        padding: 20px;
        border-radius: 8px;
        width: calc(100% - 50% - 10px);
        float: right;
        height: 100%;
        overflow: auto;
      }
    }
    .backtext {
      font-size: 14px;
      cursor: pointer;
      .svg-icon {
        margin-right: 6px;
      }
    }
  }

  .rightInfo {
    border-radius: 8px;
    .infos {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 20px;
      margin-right: 10px;

      .feedback {
        cursor: pointer;
      }

      .feedback :hover {
        color: #206aff;
      }
    }

  }



  .basicInfos {
    img {
      width: 80px;
      height: auto;
      margin-left: 10px
    }
    .el-select {
      width: 100%;
    }
    .el-form-item {
      color: #ffffff;
      margin-left: 0 !important;
    }
    .workInfo {
      font-weight: 900;
      margin-bottom: 10px;
      img {
        width: 15px;
        height: auto;
        margin-left: 0;
      }
    }

  }

  .flexBoxBetween {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  ::v-deep .el-textarea.el-input--small .el-textarea__inner {
    resize: none;
  }

  .dot {
    width: 10px;
    height: 10px;
    background-color: gray;
    border-radius: 50%;
    position: relative;
    left: 2px;
    top: 2px;
  }

  /*//激活元素*/
  .active {
    background-color: rgba(44, 143, 233, 1) !important;
  }

  /*// 隐藏元素*/
  .none {
    /*background-color: transparent !important;*/
    border-color: transparent !important;
  }

  .bgc {
    background-color: #fff;
  }

  ::v-deep .el-divider--horizontal {
    background-color: #afb9d0;
    margin: 20px 0;
    opacity: 0.15
  }

  .cancelStatus {
    color: #ff3333 !important;
  }

  .evaluatedStatus {
    color: #206aff !important;
  }

  .handleStatus {
    color: #ff7409 !important;
  }

  .waitStatus {
    color: #ffc809 !important;
  }

  .finishStatus {
    color: #3ce500 !important;
  }

  .stepss .steps_item .s_l .info_item .title {

    line-height: 32px;
    font-weight: bold;
  }

  // page {
  //   // background-color: #f2f2f2;
  // }

  .bg {

    display: flex;
  }

  .contents {
    display: flex;
    flex-wrap: wrap;
    img {
      width: 60px;
      height: auto;
      background-size: 100%;
      padding: 5px;
    }

  }

  .stepss {
    display: flex;
    flex-direction: column;
    overflow: auto;
    height: calc(100% - 65px);
    .steps_item {
      display: flex;
      .s_r {
        padding: 0 20px;
        display: flex;
        flex-direction: column;
        .line {
          flex: 1;
          border-right: 1px dashed #afb9d0;
          margin-right: 10px;
        }
        .index {
          width: 40px;
          height: 40px;
          font-size: 12px;
          text-align: center;
          line-height: 40px;
          border-radius: 50px;
        }
        .lines {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }

      .s_l {
        display: flex;
        flex-direction: column;
        padding: 10px 0;
        flex: 1;
        .info_item {
          box-shadow: 0 2px 12px 0 rgba(0,0,0, .1);
          border-radius: 10px;
          display: flex;
          justify-content: space-between;
          margin-right: 10px;
          padding: 20px;
          flex-direction: column;
          span {
            font-size: 14px;
            font-weight: 500;
            line-height: 50px;
          }
          div {
            font-size: 12px;
            line-height: 28px;
            
            text-overflow: ellipsis;
          }
          .titleStatus {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .title {
              font-size: 14px;
              margin-top: -9px;
            }
          }
          .stars {
            display: flex;
          }
          .colspan {
            font-size: 14px;
            font-weight: 400;
            color: rgba(102, 102, 102, 1);
            line-height: 20px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: flex;
            flex-direction: column;
          }
        }
      }
      .s_m {
        width: 62px;
        line-height: 20px;
        font-size: 12px;
        justify-content: center;
        display: flex;
        flex-direction: column;
        text-align: right;
      }
    }
  }

  .svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
    cursor: pointer;
  }

  .svg-external-icon {
    background-color: currentColor;
    mask-size: cover !important;
    display: inline-block;
  }

  .imgs {
    width: 60%;
    height: auto;
  }

  ::v-deep .images > .el-dialog__wrapper .el-dialog .el-dialog__body {
    height: 60vh !important;
    overflow: auto !important;
    margin-bottom:20px;
  }
</style>
