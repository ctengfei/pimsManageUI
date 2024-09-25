<template>
  <el-dialog
    :title="isEdit ? '修改特殊人群信息' : '查看特殊人群信息'"
    :visible.sync="value"
    direction="rtl"
    size="40%"
    width="600px"
    ref="drawer"
    :before-close="beforeClose"
    @opened="drawerOpen"
  >
    <!-- <el-steps :active="stepActive" align-center>
      <el-step title="基本信息" icon="el-icon-edit"></el-step>
      <el-step title="户籍信息" icon="el-icon-user"></el-step>
    </el-steps> -->
    <div class="tabLan">
      <el-tabs v-model="rytype" @tab-click="handleClick">
        <el-tab-pane
          label="刑满释放人员"
          name="1"
          v-if="stateObj.xmsf"
        ></el-tab-pane>
        <el-tab-pane
          label="社区矫正人员"
          name="2"
          v-if="stateObj.sqjz"
        ></el-tab-pane>
        <el-tab-pane
          label="精神障碍患者"
          name="3"
          v-if="stateObj.jsza"
        ></el-tab-pane>
        <el-tab-pane
          label="吸毒人员"
          name="4"
          v-if="stateObj.xdry"
        ></el-tab-pane>
        <el-tab-pane
          label="艾滋病危险人员"
          name="5"
          v-if="stateObj.azb"
        ></el-tab-pane>
      </el-tabs>
    </div>
    <el-form :model="jbxx" label-width="80px" disabled v-if="!isEdit">
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名">
            <el-input v-model="jbxx.xm" placeholder="请输入姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="曾用名">
            <el-input v-model="jbxx.zym" placeholder="请输入曾用名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别">
            <el-select v-model="jbxx.xb" placeholder="请选择">
              <el-option
                v-for="dict in dict.type.sys_user_sex"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出生日期">
            <el-date-picker
              clearable
              size="small"
              v-model="jbxx.csrq"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择出生日期"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="民族" prop="mz">
            <el-select v-model="jbxx.mz" placeholder="请选择">
              <el-option
                v-for="dict in dict.type.gb_mz"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="籍贯" prop="jg">
            <el-cascader
              v-model="jbxx.jg"
              :options="options"
              :props="areaProps"
              clearable
              style="width: 100%"
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="婚姻状况" prop="hyzk">
            <el-select v-model="jbxx.hyzk" placeholder="请选择">
              <el-option
                v-for="dict in dict.type.gb_hyzk"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="政治面貌" prop="zzmm">
            <el-select v-model="jbxx.zzmm" placeholder="请选择">
              <el-option
                v-for="dict in dict.type.gb_zzmm"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="文化程度" prop="xl">
            <el-select v-model="jbxx.xl" placeholder="请选择">
              <el-option
                v-for="dict in dict.type.gb_xldm"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="宗教信仰" prop="zjxy">
            <el-select v-model="jbxx.zjxy" placeholder="请选择">
              <el-option
                v-for="dict in dict.type.ga_zjxy"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="职业类别" prop="zylb">
            <el-cascader
              v-model="jbxx.zylb"
              :options="zylboptions"
              :props="zylbareaProps"
              clearable
              style="width: 100%"
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系方式" prop="lxfs">
            <el-input v-model="jbxx.lxfs" placeholder="请输入联系方式" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="职业信息" prop="zyxx">
            <el-input v-model="jbxx.zyxx" placeholder="请输入职业信息" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="户籍区划" prop="hjqh">
            <el-cascader
              v-model="jbxx.hjqh"
              :options="options"
              :props="areaProps"
              clearable
              style="width: 100%"
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <!-- <el-form-item label="户籍地址"
                        prop="hjxz">
            <el-select v-model="jbxx.hjxz"
                       placeholder="请选择">
              <el-option v-for="item in fwList"
                         :key="item.id"
                         :label="item.fwdzxz"
                         :value="item.fwdzid"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item v-if="jbxx.hjxzAddr" label="户籍地址" prop="hjxzAddr">
            <el-input v-model="jbxx.hjxzAddr" placeholder="未知"> </el-input>
            <!-- <el-select v-model="jbxx.hjxzAddr" placeholder="请选择">
                <el-option
                  v-for="item in fwList"
                  :key="item.id"
                  :label="item.fwdzxz"
                  :value="item.fwdzid"
                ></el-option>
              </el-select> -->
          </el-form-item>
          <el-form-item v-else label="户籍地址" prop="hjxz">
            <el-input v-model="jbxx.hjxz" placeholder="未知"> </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="居住地址" prop="xzdxz">
            <el-select v-model="jbxx.xzdxz" placeholder="请选择">
              <el-option
                v-for="item in fwList"
                :key="item.id"
                :label="item.fwdzxz"
                :value="item.fwdzid"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row>
          <el-form-item label="照片：">
            <el-upload
              ref="upload"
              :headers="uploadHeaders"
              :limit="1"
              :on-change="handlePicChange"
              :on-exceed="handleExceed"
              :file-list="fileList"
              :action="uploadUrl"
              list-type="picture-card"
              :auto-upload="true"
              accept=".gif,.jpg,.jpeg,.png"
              :before-upload="beforeAvatarUpload"
            >
              <i slot="default" class="el-icon-plus"></i>
              <div
                slot="file"
                slot-scope="{ file }"
                style="width: 100%; height: 100%"
              >
                <img
                  class="el-upload-list__item-thumbnail"
                  :src="file.url"
                  alt=""
                  style="width: 100%; height: 100%"
                />
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(file)"
                  >
                    <i class="el-icon-zoom-in"></i>
                  </span>
                  <span
                    class="el-upload-list__item-delete"
                    @click="handleRemove(file, fileList)"
                  >
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
              </div>
            </el-upload>
          </el-form-item>
        </el-row> -->
    </el-form>
    <el-divider v-if="!isEdit"></el-divider>
    <div class="drawerForm-container">
      <el-form
        :model="
          rytype == '1'
            ? xmsfForm
            : rytype == '2'
            ? sqjzForm
            : rytype == '3'
            ? jszaForm
            : rytype == '4'
            ? xdForm
            : azbForm
        "
        :rules="
          rytype == '1'
            ? xmsfRules
            : rytype == '2'
            ? sqjzRules
            : rytype == '3'
            ? jszaRules
            : rytype == '4'
            ? xdRules
            : azbRules
        "
        ref="form"
        :disabled="!isEdit"
        label-width="80px"
      >
        <el-row v-if="rytype == '1'" :key="1">
          <el-col :span="12">
            <el-form-item label="身份证号" prop="sfzhm">
              <el-input v-model="xmsfForm.sfzhm" placeholder="请输入身份证号">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否累犯" prop="sflf">
              <el-select v-model="xmsfForm.sflf" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.sys_yes_no"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="原罪名" prop="yzm">
              <el-select v-model="xmsfForm.yzm" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.gb_zmfldm"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="原判日期" prop="ypxq">
              <el-date-picker
                clearable
                size="small"
                v-model="xmsfForm.ypxq"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择原判日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="服刑场所" prop="fxcs">
              <el-input v-model="xmsfForm.fxcs" placeholder="请输入服刑场所" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="释放日期" prop="sfrq">
              <el-date-picker
                clearable
                size="small"
                v-model="xmsfForm.sfrq"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择释放日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="危险性评估类型" prop="wxxpglx">
              <el-select v-model="xmsfForm.wxxpglx" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.gb_wxxpglx"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="衔接日期" prop="xjrq">
              <el-date-picker
                clearable
                size="small"
                v-model="xmsfForm.xjrq"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择衔接日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="clear: both">
            <el-form-item label="衔接情况" prop="xjqk">
              <el-input v-model="xmsfForm.xjqk" placeholder="请输入衔接情况" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="安置日期" prop="azrq">
              <el-date-picker
                clearable
                size="small"
                v-model="xmsfForm.azrq"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择安置日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="安置情况" prop="azqk">
              <el-select v-model="xmsfForm.azqk" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.gb_azjk"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="未安置原因" prop="wazyy">
              <el-input
                v-model="xmsfForm.wazyy"
                placeholder="请输入未安置原因"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="帮教情况" prop="bjqk">
              <el-input v-model="xmsfForm.bjqk" placeholder="请输入帮教情况" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否重新犯罪" prop="sfcxfz">
              <el-select v-model="xmsfForm.sfcxfz" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.sys_yes_no"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="重新犯罪罪名" prop="cxfzzm">
              <el-input
                v-model="xmsfForm.cxfzzm"
                placeholder="请输入重新犯罪罪名"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="rytype == '2'" :key="2">
          <el-col :span="12">
            <el-form-item label="身份证号" prop="sfzhm">
              <el-input v-model="sqjzForm.sfzhm" placeholder="请输入身份证号">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="社区矫正人员编号" prop="sqjzrybh">
              <el-input
                v-model="sqjzForm.sqjzrybh"
                placeholder="请输入社区矫正人员编号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="原羁押场所" prop="yjycs">
              <el-input
                v-model="sqjzForm.yjycs"
                placeholder="请输入原羁押场所"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="矫正类别" prop="jzlb">
              <el-select v-model="sqjzForm.jzlb" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.gb_jzlb"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="案件类别" prop="ajlb">
              <el-select v-model="sqjzForm.ajlb" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.ga_ajlb"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="具体罪名" prop="jtzm">
              <el-input v-model="sqjzForm.jtzm" placeholder="请输入具体罪名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="原判刑期" prop="ypxq">
              <el-input v-model="sqjzForm.ypxq" placeholder="请输入原判刑期" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="原判刑开始日期" prop="ypxksrq">
              <el-date-picker
                clearable
                size="small"
                v-model="sqjzForm.ypxksrq"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择原判刑开始日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="原判刑结束日期" prop="ypxjsrq">
              <el-date-picker
                clearable
                size="small"
                v-model="sqjzForm.ypxjsrq"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择原判刑结束日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="矫正开始日期" prop="jzksrq">
              <el-date-picker
                clearable
                size="small"
                v-model="sqjzForm.jzksrq"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择矫正开始日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="clear: both">
            <el-form-item label="矫正结束日期" prop="jzjsrq">
              <el-date-picker
                clearable
                size="small"
                v-model="sqjzForm.jzjsrq"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择矫正结束日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="接收方式" prop="jsfs">
              <el-select v-model="sqjzForm.jsfs" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.gb_jsfs"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="clear: both">
            <el-form-item label="“四史”情况" prop="sishiqk">
              <el-select v-model="sqjzForm.sishiqk" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.gb_sisqk"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否累惯犯" prop="sflgf">
              <el-select v-model="sqjzForm.sflgf" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.sys_yes_no"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="三涉情况" prop="sanshiqk">
              <el-select v-model="sqjzForm.sanshiqk" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.gb_sasqk"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否建立矫正小组" prop="sfjljzxz">
              <el-select v-model="sqjzForm.sfjljzxz" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.sys_yes_no"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="矫正小组人员组成情况" prop="jzxzryzcqk">
              <el-select v-model="sqjzForm.jzxzryzcqk" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.gb_jzxzzc"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="矫正接触(终止)类型" prop="jzjclx">
              <el-select v-model="sqjzForm.jzjclx" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.gb_jzjczz"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否有脱管" prop="sfytg">
              <el-select v-model="sqjzForm.sfytg" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.sys_yes_no"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="脱管原因" prop="tgyy">
              <el-input v-model="sqjzForm.tgyy" placeholder="请输入脱管原因" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检查监督脱管情况" prop="jcjdtgqk">
              <el-input
                v-model="sqjzForm.jcjdtgqk"
                placeholder="请输入检查监督脱管情况"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="脱管纠正情况" prop="tgjzqk">
              <el-input
                v-model="sqjzForm.tgjzqk"
                placeholder="请输入脱管纠正情况"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="clear: both">
            <el-form-item label="是否有漏管" prop="sfylg">
              <el-select v-model="sqjzForm.sfylg" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.sys_yes_no"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="漏管原因" prop="lgyy">
              <el-input v-model="sqjzForm.lgyy" placeholder="请输入漏管原因" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检查监督漏管情况" prop="jcjdlgqk">
              <el-input
                v-model="sqjzForm.jcjdlgqk"
                placeholder="请输入检查监督漏管情况"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="漏管纠正情况" prop="lgjzqk">
              <el-input
                v-model="sqjzForm.lgjzqk"
                placeholder="请输入漏管纠正情况"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="clear: both">
            <el-form-item label="奖惩情况" prop="jcqk">
              <el-input v-model="sqjzForm.jcqk" placeholder="请输入奖惩情况" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="刑罚变更执行情况" prop="xfbgzxqk">
              <el-input
                v-model="sqjzForm.xfbgzxqk"
                placeholder="请输入刑罚变更执行情况"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否重新犯罪" prop="sfcxfz">
              <el-select v-model="sqjzForm.sfcxfz" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.sys_yes_no"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="重新犯罪名称" prop="cxfzmc">
              <el-input
                v-model="sqjzForm.cxfzmc"
                placeholder="请输入监护人姓名"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="rytype == '3'" :key="3">
          <el-col :span="12">
            <el-form-item label="身份证号" prop="sfzhm">
              <el-input v-model="jszaForm.sfzhm" placeholder="请输入身份证号">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="家庭经济情况" prop="jtjjqk">
              <el-select v-model="jszaForm.jtjjqk" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.gb_jtjjzk"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否纳入低保" prop="sfnrdb">
              <el-select v-model="jszaForm.sfnrdb" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.sys_yes_no"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="监护人公民身份号码" prop="jhrgmsfzhm">
              <el-input
                v-model="jszaForm.jhrgmsfzhm"
                placeholder="请输入监护人公民身份号码"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="监护人姓名" prop="jhrxm">
              <el-input
                v-model="jszaForm.jhrxm"
                placeholder="请输入监护人姓名"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="监护人联系方式" prop="jhrlxfs">
              <el-input
                v-model="jszaForm.jhrlxfs"
                placeholder="请输入监护人联系方式"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="初次发病日期" prop="ccfbrq">
              <el-date-picker
                clearable
                size="small"
                v-model="jszaForm.ccfbrq"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择初次发病日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目前诊断类型" prop="mqzdlx">
              <el-select v-model="jszaForm.mqzdlx" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.gb_mqzdlx"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="clear: both">
            <el-form-item label="有无肇事肇祸史" prop="ywzszhrq">
              <el-select v-model="jszaForm.ywzszhrq" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.sys_yes_no"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="肇事肇祸次数" prop="zszhcs">
              <el-input
                v-model="jszaForm.zszhcs"
                placeholder="请输入肇事肇祸次数"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="clear: both">
            <el-form-item label="上次肇事肇祸日期" prop="sczszhrq">
              <el-date-picker
                clearable
                size="small"
                v-model="jszaForm.sczszhrq"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择上次肇事肇祸日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目前危险性评估等级" prop="mqwxxpgdj">
              <el-select v-model="jszaForm.mqwxxpgdj" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.gb_mqwxxpgdj"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="治疗情况" prop="zlqk">
              <el-select v-model="jszaForm.zlqk" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.gb_zlqk"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="治疗医院名称" prop="zlyymc">
              <el-input
                v-model="jszaForm.zlyymc"
                placeholder="请输入治疗医院名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实施住院医疗原因" prop="sszyzlyy">
              <el-select v-model="jszaForm.sszyzlyy" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.gb_sszyzlyy"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="接收康复训练机构名称" prop="jskfxljgmc">
              <el-input
                v-model="jszaForm.jskfxljgmc"
                placeholder="请输入监护人居住详址"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="参与管理人员" prop="cyglry">
              <el-input
                v-model="jszaForm.cyglry"
                placeholder="请输入监护人居住详址"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="帮扶情况" prop="bfqk">
              <el-select v-model="jszaForm.bfqk" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.gb_bfqk"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="rytype == '4'" :key="4">
          <el-col :span="12">
            <el-form-item label="身份证号" prop="sfzhm">
              <el-input v-model="xdForm.sfzhm" placeholder="请输入身份证号">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="初次发现日期" prop="ccfxrq">
              <el-date-picker
                clearable
                size="small"
                v-model="xdForm.ccfxrq"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择初次发现日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="管控情况" prop="gkqk">
              <el-select v-model="xdForm.gkqk" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.zdy_gkxz"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="管控人姓名" prop="gkrxm">
              <el-input v-model="xdForm.gkrxm" placeholder="请输入家庭情况" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="管控人联系方式" prop="gkrlxfs">
              <el-input v-model="xdForm.gkrlxfs" placeholder="请输入家庭情况" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="帮扶情况" prop="bfqk">
              <el-select v-model="xdForm.bfqk" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.gb_bfqk"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="clear: both">
            <el-form-item label="帮扶人姓名" prop="bfrxm">
              <el-input v-model="xdForm.bfrxm" placeholder="请输入家庭情况" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="帮扶人联系方式" prop="bfrlxfs">
              <el-input v-model="xdForm.bfrlxfs" placeholder="请输入家庭情况" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="有无犯罪史" prop="ywfzs">
              <el-select v-model="xdForm.ywfzs" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.sys_yes_no"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="犯罪情况" prop="fzqk">
              <el-input v-model="xdForm.fzqk" placeholder="请输入家庭情况" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="吸毒原因" prop="xdyy">
              <el-select v-model="xdForm.xdyy" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.ga_xdyy"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="吸毒后果" prop="xdhg">
              <el-input v-model="xdForm.xdhg" placeholder="请输入吸毒后果" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="rytype == '5'" :key="5">
          <el-col :span="12">
            <el-form-item label="身份证号" prop="sfzhm">
              <el-input v-model="azbForm.sfzhm" placeholder="请输入身份证号">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="感染途径" prop="grtj">
              <el-select v-model="azbForm.grtj" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.gb_grtj"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否有违法犯罪史" prop="sfywffzs">
              <el-select v-model="azbForm.sfywffzs" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.sys_yes_no"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
              <!-- <el-input v-model="azbForm.sfywffzs" placeholder="请输入身份证号">
              </el-input> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="违法犯罪情况" prop="wffzqk">
              <el-input v-model="azbForm.wffzqk" placeholder="请输入身份证号">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="clear: both">
            <el-form-item label="案件类别" prop="ajlb">
              <el-select v-model="azbForm.ajlb" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.ga_ajlb"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关注类型" prop="gzlx">
              <el-select v-model="azbForm.gzlx" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.gb_gzlx"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="帮扶情况" prop="bfqk">
              <el-select v-model="azbForm.bfqk" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.gb_bfqk"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
              <!-- <el-input v-model="azbForm.bfqk" placeholder="请输入身份证号">
              </el-input> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="帮扶人姓名" prop="bfrxm">
              <el-input v-model="azbForm.bfrxm" placeholder="请输入身份证号">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="帮扶人联系方式" prop="bfrlxfs">
              <el-input v-model="azbForm.bfrlxfs" placeholder="请输入身份证号">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收治情况" prop="szqk">
              <el-select v-model="azbForm.szqk" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.gb_szqk"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="clear: both">
            <el-form-item label="收治机构名称" prop="szjgmc">
              <el-input v-model="azbForm.szjgmc" placeholder="请输入身份证号">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        @click="drawerCancelBtn"
        v-if="!isEdit"
        >关闭
      </el-button>
      <el-button
        type="primary"
        @click="changeStep"
        v-if="isEdit"
      >
        确定</el-button
      >
      <el-button
        @click="drawerCancelBtn"
        v-if="isEdit"
      >
        取消
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getGaryInfo } from '@/api/jcyw/syrk/tsrq'
import { getToken } from '@/utils/auth'
import { query } from '@/api/jcyw/syfw/fwgl'
import { getAreaTree, getZylbTree } from '@/api/jcyw/syrk/hjrk'
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    value: {
      type: Boolean,
      default: false
    },
    depData: Object
  },
  dicts: [
    'gb_szqk',
    'gb_gzlx',
    'gb_grtj',
    'ga_xdyy',
    'zdy_gkxz',
    'gb_bfqk',
    'gb_sszyzlyy',
    'gb_zlqk',
    'gb_mqwxxpgdj',
    'gb_mqzdlx',
    'gb_jtjjzk',
    'gb_jzjczz',
    'gb_jzxzzc',
    'gb_sasqk',
    'gb_sisqk',
    'gb_jsfs',
    'gb_jzlb',
    'gb_azjk',
    'gb_wxxpglx',
    'gb_zmfldm',
    'sys_yes_no',
    'st_jkzk',
    'sys_user_sex',
    'gb_yhzgx',
    'ga_zjxy',
    'gb_xldm',
    'gb_zylb',
    'gb_zzmm',
    'gb_hyzk',
    'gb_mz',
    'gb_zylb',
    'gb_rhyzbz',
    'ga_ajlb'
  ],
  data() {
    return {
      stateObj: {
        xmsf: false,
        sqjz: false,
        jsza: false,
        xdry: false,
        azb: false
      },
      rytype: '',
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      timer: null,
      uploadSite: process.env.VUE_APP_BASE_API + '/common/upload', // 上传的图片服务器地址
      uploadUrl: '',
      uploadHeaders: {
        Authorization: 'Bearer ' + getToken()
      },
      fwList: [],
      xmsfForm: {
        id: '',
        sfzhm: '',
        sflf: '',
        yzm: '',
        ypxq: '',
        fxcs: '',
        sfrq: '',
        wxxpglx: '',
        xjrq: '',
        xjqk: '',
        azrq: '',
        azqk: '',
        wazyy: '',
        bjqk: '',
        sfcxfz: '',
        cxfzzm: ''
      },
      sqjzForm: {
        id: '',
        sfzhm: '',
        sqjzrybh: '',
        yjycs: '',
        jzlb: '',
        ajlb: '',
        jtzm: '',
        ypxq: '',
        ypxksrq: '',
        ypxjsrq: '',
        jzksrq: '',
        jzjsrq: '',
        jsfs: '',
        sishiqk: '',
        sflgf: '',
        sanshiqk: '',
        sfjljzxz: '',
        jzxzryzcqk: '',
        jzjclx: '',
        sfytg: '',
        tgyy: '',
        jcjdtgqk: '',
        tgjzqk: '',
        sfylg: '',
        lgyy: '',
        jcjdlgqk: '',
        lgjzqk: '',
        jcqk: '',
        xfbgzxqk: '',
        sfcxfz: '',
        cxfzmc: ''
      },
      jszaForm: {
        id: '',
        sfzhm: '',
        jtjjqk: '',
        sfnrdb: '',
        jhrgmsfzhm: '',
        jhrxm: '',
        jhrlxfs: '',
        ccfbrq: '',
        mqzdlx: '',
        ywzszhrq: '',
        zszhcs: '',
        sczszhrq: '',
        mqwxxpgdj: '',
        zlqk: '',
        zlyymc: '',
        sszyzlyy: '',
        jskfxljgmc: '',
        cyglry: '',
        bfqk: ''
      },
      xdForm: {
        id: '',
        sfzhm: '',
        ccfxrq: '',
        gkqk: '',
        gkrxm: '',
        gkrlxfs: '',
        bfqk: '',
        bfrxm: '',
        bfrlxfs: '',
        ywfzs: '',
        fzqk: '',
        xdyy: '',
        xdhg: ''
      },
      azbForm: {
        id: '',
        sfzhm: '',
        grtj: '',
        sfywffzs: '',
        wffzqk: '',
        ajlb: '',
        gzlx: '',
        bfqk: '',
        bfrxm: '',
        bfrlxfs: '',
        szqk: '',
        szjgmc: ''
      },
      xmsfRules: {
        sfzhm: [
          {
            required: true,
            pattern:
              /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/,
            message: '请输入正确的身份证号',
            trigger: 'blur'
          }
        ]
      },
      sqjzRules: {
        sfzhm: [
          {
            required: true,
            pattern:
              /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/,
            message: '请输入正确的身份证号',
            trigger: 'blur'
          }
        ],
        sqjzrybh: [
          {
            required: true,
            message: '请输入正确的社区矫正人员编号',
            trigger: 'blur'
          }
        ],
        jzlb: [
          {
            required: true,
            message: '请选择矫正类别',
            trigger: 'change'
          }
        ],
        ajlb: [
          {
            required: true,
            message: '请选择案件类别',
            trigger: 'change'
          }
        ],
        sfcxfz: [
          {
            required: true,
            message: '请选择是否重新犯罪',
            trigger: 'change'
          }
        ],
      },
      jszaRules: {
        sfzhm: [
          {
            required: true,
            pattern:
              /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/,
            message: '请输入正确的身份证号',
            trigger: 'blur'
          }
        ],
        sfnrdb: [
          {
            required: true,
            message: '请选择是否纳入低保',
            trigger: 'change'
          }
        ],
        jhrxm: [
          {
            required: true,
            message: '请输入监护人姓名',
            trigger: 'blur'
          }
        ],
        jhrlxfs: [
          {
            required: true,
            message: '请输入监护人联系方式',
            trigger: 'blur'
          }
        ],
        mqzdlx: [
          {
            required: true,
            message: '请选择目前诊断类型',
            trigger: 'change'
          }
        ],
        ywzszhrq: [
          {
            required: true,
            message: '请选择有无肇事肇祸史',
            trigger: 'change'
          }
        ],
        mqwxxpgdj: [
          {
            required: true,
            message: '请选择目前危险性评估等级',
            trigger: 'change'
          }
        ],
        zlqk: [
          {
            required: true,
            message: '请选择治疗情况',
            trigger: 'change'
          }
        ],
      },
      xdRules: {
        sfzhm: [
          {
            required: true,
            pattern:
              /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/,
            message: '请输入正确的身份证号',
            trigger: 'blur'
          }
        ],
        ccfxrq: [
          {
            required: true,
            message: '请选择初次发现日期',
            trigger: 'change'
          }
        ],
        gkqk: [
          {
            required: true,
            message: '请选择管控情况',
            trigger: 'change'
          }
        ],
        gkrxm: [
          {
            required: true,
            message: '请输入管控人姓名',
            trigger: 'blur'
          }
        ],
        gkrlxfs: [
          {
            required: true,
            message: '请输入管控人联系方式',
            trigger: 'blur'
          }
        ],
        bfrxm: [
          {
            required: true,
            message: '请输入帮扶人姓名',
            trigger: 'blur'
          }
        ],
        bfrlxfs: [
          {
            required: true,
            message: '请输入帮扶人联系方式',
            trigger: 'blur'
          }
        ],
      },
      azbRules: {
        sfzhm: [
          {
            required: true,
            pattern:
              /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/,
            message: '请输入正确的身份证号',
            trigger: 'blur'
          }
        ],
        grtj: [
          {
            required: true,
            message: '请选择感染途径',
            trigger: 'change'
          }
        ],
        sfywffzs: [
          {
            required: true,
            message: '请选择是否有违法犯罪史',
            trigger: 'change'
          }
        ],
        gzlx: [
          {
            required: true,
            message: '请选择关注类型',
            trigger: 'change'
          }
        ],
        bfrxm: [
          {
            required: true,
            message: '请输入帮扶人姓名',
            trigger: 'blur'
          }
        ],
        bfrlxfs: [
          {
            required: true,
            message: '请输入帮扶人联系方式',
            trigger: 'blur'
          }
        ],
      },
      jbxx: {},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      options: [],
      areaProps: {
        value: 'areaCode',
        label: 'areaName',
        children: 'children',
        emitPath: false
      },
      zylboptions: [],
      zylbareaProps: {
        value: 'zylbCode',
        label: 'zylbName',
        children: 'children',
        emitPath: false
      }
    }
  },
  watch: {
    // depData: {
    //   handler (val) {
    //     this.stateObj = {
    //       xmsf: false,
    //       sqjz: false,
    //       jsza: false,
    //       xdry: false,
    //       azb: false
    //     }
    //     this.rytype = ''
    //     this.jbxx = val
    //     this.autoComplete(val)
    //   },
    //   deep: true
    // }
    // stateObj: {
    //   handler (val) {
    //     console.log(this.depData)
    //   },
    //   deep: true
    // }
  },
  mounted() {
    getAreaTree().then((res) => {
      if (res.code === 200) {
        this.options = res.data
      }
    })
    getZylbTree().then((res) => {
      this.zylboptions = res.data
    })
  },
  methods: {
    handleClick(tab, event) {},
    drawerOpen() {
      this.$refs['form'].clearValidate()
    },
    removeZp() {
      this.form.zp = ''
      this.uploadUrl = ''
    },
    handleFileSuccess(res) {
      this.form.zp = res.fileName
      this.uploadUrl = res.url
    },
    async autoComplete(row) {
      this.stateObj = {
        xmsf: false,
        sqjz: false,
        jsza: false,
        xdry: false,
        azb: false
      }
      this.rytype = ''
      this.jbxx = row
      let getHjrkRes = await getGaryInfo(row.sfzhm, row.bqId)
      if (!getHjrkRes.data) return
      // 刑满释放人员
      if (getHjrkRes.data.zhzzJcywSyrkTsrqXmsfryList.length > 0) {
        for (let k in this.xmsfForm) {
          this.xmsfForm[k] = getHjrkRes.data.zhzzJcywSyrkTsrqXmsfryList[0][k]
        }
      }
      //社区矫正人员
      if (getHjrkRes.data.zhzzJcywSyrkTsrqSqjzryList.length > 0) {
        for (let k in this.sqjzForm) {
          this.sqjzForm[k] = getHjrkRes.data.zhzzJcywSyrkTsrqSqjzryList[0][k]
        }
      }
      //精神障碍患者
      if (getHjrkRes.data.zhzzJcywSyrkTsrqJszahzList.length > 0) {
        for (let k in this.jszaForm) {
          this.jszaForm[k] = getHjrkRes.data.zhzzJcywSyrkTsrqJszahzList[0][k]
        }
      }
      //吸毒人员
      if (getHjrkRes.data.zhzzJcywSyrkTsrqXdryList.length > 0) {
        for (let k in this.xdForm) {
          this.xdForm[k] = getHjrkRes.data.zhzzJcywSyrkTsrqXdryList[0][k]
        }
      }
      //艾滋病患者
      if (getHjrkRes.data.zhzzJcywSyrkTsrqAzbwxryList.length > 0) {
        for (let k in this.azbForm) {
          this.azbForm[k] = getHjrkRes.data.zhzzJcywSyrkTsrqAzbwxryList[0][k]
        }
      }
      if (row.bqId.indexOf(3416) != -1) {
        this.rytype = '1'
      } else {
        if (row.bqId.indexOf(3417) != -1) {
          this.rytype = '2'
        } else {
          if (row.bqId.indexOf(3418) != -1) {
            this.rytype = '3'
          } else {
            if (row.bqId.indexOf(3419) != -1) {
              this.rytype = '4'
            } else {
              if (row.bqId.indexOf(3420) != -1) {
                this.rytype = '5'
              } else {
              }
            }
          }
        }
      }
      row.bqId.indexOf(3416) == -1
        ? (this.stateObj.xmsf = false)
        : (this.stateObj.xmsf = true)
      row.bqId.indexOf(3417) == -1
        ? (this.stateObj.sqjz = false)
        : (this.stateObj.sqjz = true)
      row.bqId.indexOf(3418) == -1
        ? (this.stateObj.jsza = false)
        : (this.stateObj.jsza = true)
      row.bqId.indexOf(3419) == -1
        ? (this.stateObj.xdry = false)
        : (this.stateObj.xdry = true)
      row.bqId.indexOf(3420) == -1
        ? (this.stateObj.azb = false)
        : (this.stateObj.azb = true)
    },
    hjxzChange() {
      this.hjxzChangeFlag = true
    },
    remoteMethod(value) {
      this.fwList = []
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.queryFwList(value)
      }, 1000)
    },
    queryFwList(value) {
      query({ fwdzxz: value, ...this.queryParams }).then((res) => {
        this.fwList = this.fwList.concat(res.rows)
      })
    },
    reset() {
      this.xmsfForm = {
        id: '',
        sfzhm: '',
        sflf: '',
        yzm: '',
        ypxq: '',
        fxcs: '',
        sfrq: '',
        wxxpglx: '',
        xjrq: '',
        xjqk: '',
        azrq: '',
        azqk: '',
        wazyy: '',
        bjqk: '',
        sfcxfz: '',
        cxfzzm: ''
      }
      this.sqjzForm = {
        id: '',
        sfzhm: '',
        sqjzrybh: '',
        yjycs: '',
        jzlb: '',
        ajlb: '',
        jtzm: '',
        ypxq: '',
        ypxksrq: '',
        ypxjsrq: '',
        jzksrq: '',
        jzjsrq: '',
        jsfs: '',
        sishiqk: '',
        sflgf: '',
        sanshiqk: '',
        sfjljzxz: '',
        jzxzryzcqk: '',
        jzjclx: '',
        sfytg: '',
        tgyy: '',
        jcjdtgqk: '',
        tgjzqk: '',
        sfylg: '',
        lgyy: '',
        jcjdlgqk: '',
        lgjzqk: '',
        jcqk: '',
        xfbgzxqk: '',
        sfcxfz: '',
        cxfzmc: ''
      }
      this.jszaForm = {
        id: '',
        sfzhm: '',
        jtjjqk: '',
        sfnrdb: '',
        jhrgmsfzhm: '',
        jhrxm: '',
        jhrlxfs: '',
        ccfbrq: '',
        mqzdlx: '',
        ywzszhrq: '',
        zszhcs: '',
        sczszhrq: '',
        mqwxxpgdj: '',
        zlqk: '',
        zlyymc: '',
        sszyzlyy: '',
        jskfxljgmc: '',
        cyglry: '',
        bfqk: ''
      }
      this.xdForm = {
        id: '',
        sfzhm: '',
        ccfxrq: '',
        gkqk: '',
        gkrxm: '',
        gkrlxfs: '',
        bfqk: '',
        bfrxm: '',
        bfrlxfs: '',
        ywfzs: '',
        fzqk: '',
        xdyy: '',
        xdhg: ''
      }
      this.azbForm = {
        id: '',
        sfzhm: '',
        grtj: '',
        sfywffzs: '',
        wffzqk: '',
        ajlb: '',
        gzlx: '',
        bfqk: '',
        bfrxm: '',
        bfrlxfs: '',
        szqk: '',
        szjgmc: ''
      }
    },
    editForm(row, type) {
      // this.rytype = type

      this.autoComplete(row, type)
    },
    // 抽屉中取消或者上一步按钮
    drawerCancelBtn() {
      this.$emit('drawerClose')
      this.reset()
    },
    validateForm() {
      return new Promise((resolve) => {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            resolve(true)
          } else {
            resolve(false)
          }
        })
      })
    },
    // 添加网格弹窗中确定按钮切换填写步骤
    async changeStep() {
      let validateRes = await this.validateForm()
      if (!validateRes) return
      if (this.rytype == '1') {
        var FormData = { ...this.xmsfForm }
      } else if (this.rytype == '2') {
        var FormData = { ...this.sqjzForm }
      } else if (this.rytype == '3') {
        var FormData = { ...this.jszaForm }
      } else if (this.rytype == '4') {
        var FormData = { ...this.xdForm }
      } else if (this.rytype == '5') {
        var FormData = { ...this.azbForm }
      }
      this.$emit('drawerClose')
      this.reset()
      this.$emit('submitForm', FormData, this.rytype)
    },
    beforeClose(done) {
      this.$emit('drawerClose')
      this.stateObj = {
        xmsf: false,
        sqjz: false,
        jsza: false,
        xdry: false,
        azb: false
      }
      this.reset()
      done()
    }
  }
}
</script>

<style lang="less" scoped>
.tabLan {
  width: 100%;
  box-sizing: border-box;
  padding: 15px 30px;
}
.drawerForm-container {
  box-sizing: border-box !important;
  padding: 15px 30px 30px 30px;
}
.el-date-editor,
.el-select {
  width: 100%;
}
::v-deep .el-input__prefix {
  top: 0px !important;
}
::v-deep .el-drawer__body {
  overflow-y: scroll !important;
  /* 滚动条样式 */
  &::-webkit-scrollbar {
    width: 7px;
    height: 7px;
  }
  &::-webkit-scrollbar-track {
    background: rgb(239, 239, 239);
    border-radius: 2px;
  }
  &::-webkit-scrollbar-thumb {
    background: #d8d8d8;
    border-radius: 5px;
  }
}
.uploadImgContainer {
  display: inline-block;
  margin-right: 10px;
  vertical-align: middle;
  background-color: #fbfdff;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 148px;
  height: 148px;
  position: relative;
  img {
    margin: 0;
    height: 100%;
    width: 100%;
  }
  .el-icon-close {
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
