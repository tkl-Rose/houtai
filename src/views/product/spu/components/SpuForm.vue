<template>
  <div>
    <el-form label-width="100px" :model="spuInfo">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spuInfo.spuName"></el-input>
      </el-form-item>

      <el-form-item label="品牌">
        <el-select v-model="spuInfo.tmId" placeholder="请选择品牌">
          <el-option
            v-for="(tm, index) in trademarkList"
            :key="tm.id"
            :label="tm.tmName"
            :value="tm.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="SPU描述">
        <el-input
          v-model="spuInfo.description"
          placeholder="SPU描述"
          type="textarea"
          rows="4"
        ></el-input>
      </el-form-item>

      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="spuImageList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog>
          <img width="100%" alt="" />
        </el-dialog>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-select
          v-model="unUsedSaleAttrIdName"
          :placeholder="
            unUsedSaleAttrList.length
              ? `还有${unUsedSaleAttrList.length}未选择`
              : '没有啦！！！'
          "
        >
          <el-option
            :label="unUsedSaleAttr.name"
            :value="`${unUsedSaleAttr.id}:${unUsedSaleAttr.name}`"
            v-for="(unUsedSaleAttr, index) in unUsedSaleAttrList"
            :key="unUsedSaleAttr.id"
          ></el-option>
        </el-select>
        <el-button
          :disabled="!unUsedSaleAttrIdName"
          @click="addSaleAttr"
          type="primary"
          icon="el-icon-plus"
          >添加销售属性</el-button
        >
        <el-table :data="spuInfo.spuSaleAttrList" border style="width: 100%">
          <el-table-column
            type="index"
            align="center"
            label="序号"
            width="80"
          ></el-table-column>

          <el-table-column prop="saleAttrName" label="属性名" width="150">
          </el-table-column>

          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row, $index }">
              <!-- " -->
              <el-tag
                v-for="(saleAttrValue, index) in row.spuSaleAttrValueList"
                :key="saleAttrValue.id"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ saleAttrValue.saleAttrValueName }}
              </el-tag>
              <el-input
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
                v-model="row.saleAttrValueName"
                v-if="row.isEdit"
                class="input-new-tag"
                ref="saveTagInput"
                size="small"
              >
              </el-input>
              <!--   -->
              <el-button
                @click="showInput(row)"
                v-else
                class="button-new-tag"
                size="small"
                >添加</el-button
              >
            </template>
          </el-table-column>

          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <HintButton
                type="danger"
                icon="el-icon-delete"
                size="mini"
                title="删除销售属性"
                @click="spuInfo.spuSaleAttrList.splice($index, 1)"
              ></HintButton>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="$emit('update:isShowSpuForm', false)"
          >取消</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      unUsedSaleAttrIdName: "",
      spuInfo: {
        category3Id: "",
        spuName: "",
        description: "",
        tmId: "",
        spuImageList: [],
        spuSaleAttrList: []
      },
      spuImageList: [],
      trademarkList: [],
      baseSaleAttrList: []
    };
  },
  methods: {
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      this.spuImageList = fileList;
    },
    // 点击图片的放大镜，预览大图
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    // 添加图片完成之后会调这个函数
    // 添加一张图片，在这里去收集最新的图片列表
    handleSuccess(res, file, fileList) {
      console.log(fileList);
      this.spuImageList = fileList;
    },
    async getInitAddSpuFormData(category3Id) {
      this.category3Id = category3Id;
      // http://localhost:9529/dev-api/admin/product/baseTrademark/getTrademarkList
      const result2 = await this.$API.trademark.getList();
      if (result2.code === 200 || result2.code === 20000) {
        this.trademarkList = result2.data;
      }
      // http://localhost:9529/dev-api/admin/product/baseSaleAttrList
      const result3 = await this.$API.spu.getSaleAttrList();
      if (result3.code === 200 || result3.code === 20000) {
        this.baseSaleAttrList = result3.data;
      }
    },
    async getInitUpdateSpuFormData(spu, category3Id) {
      this.category3Id = category3Id;
      // 这里面就是写4个请求
      // http://localhost:9529/dev-api/admin/product/getSpuById/1230
      const result = await this.$API.spu.get(spu.id);
      if (result.code === 200 || result.code === 20000) {
        this.spuInfo = result.data;
      }
      // http://localhost:9529/dev-api/admin/product/spuImageList/1230
      const result1 = await this.$API.sku.getSpuImageList(spu.id);
      if (result1.code === 200 || result1.code === 20000) {
        const spuImageList = result1.data;

        // 往每个图片对象当中添加name和url
        spuImageList.forEach(item => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = spuImageList;
      }
      // http://localhost:9529/dev-api/admin/product/baseTrademark/getTrademarkList
      const result2 = await this.$API.trademark.getList();
      if (result2.code === 200 || result2.code === 20000) {
        this.trademarkList = result2.data;
      }
      // http://localhost:9529/dev-api/admin/product/baseSaleAttrList
      const result3 = await this.$API.spu.getSaleAttrList();
      if (result3.code === 200 || result3.code === 20000) {
        this.baseSaleAttrList = result3.data;
      }
    },
    // 点击添加销售属性按钮
    addSaleAttr() {
      // 1、把收集的数据变为一个对象
      let [baseSaleAttrId, saleAttrName] = this.unUsedSaleAttrIdName.split(":");
      let obj = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
      };
      // 2、把对象添加指定的数组当中
      this.spuInfo.spuSaleAttrList.push(obj);

      // 清空选中的项
      this.unUsedSaleAttrIdName = "";
    },
    // 点击添加按钮（添加属性值按钮）
    showInput(row) {
      // row.isEdit = true
      this.$set(row, "isEdit", true);
      this.$set(row, "saleAttrValueName", "");

      this.$nextTick(() => {
        this.$refs.saveTagInput.focus();
      });
    },
    //失去焦点
    handleInputConfirm(row) {
      let { baseSaleAttrId, saleAttrValueName } = row;

      // 判断输入的属性值是不是空白
      if (saleAttrValueName.trim() === "") {
        row.saleAttrValueName = "";
        row.isEdit = false;
        // this.$message.error('输入的属性值不能是空白')
        return;
      }

      // 判断输入的属性值是不是重复，不用除去自身，因为自身还没有添加到属性值列表当中
      // 之前我们做的平台属性值，是先添加进去占位，回头才去输入的值，所以得除去自身
      let isRepeat = row.spuSaleAttrValueList.some(
        item => item.saleAttrValueName === saleAttrValueName
      );
      if (isRepeat) {
        row.saleAttrValueName = "";
        row.isEdit = false;
        this.$message.error("输入的属性值不能重复");
        return;
      }

      let obj = { baseSaleAttrId, saleAttrValueName };
      row.spuSaleAttrValueList.push(obj);

      row.saleAttrValueName = "";
      row.isEdit = false;
    },
    // 保存操作
    async save() {
      // 获取请求参数
      let { category3Id, spuInfo, spuImageList } = this;

      spuInfo.category3Id = category3Id;

      spuInfo.spuImageList = spuImageList.map(item => {
        return {
          imgName: item.name,
          imgUrl: item.imgUrl || item.response.data
        };
      });

      spuInfo.spuSaleAttrList.forEach(item => {
        delete item.isEdit;
        delete item.saleAttrValueName;
      });
      // 发请求
      try {
        // 成功干啥
        const result = await this.$API.spu.addUpdate(spuInfo);
        if (result.code === 200 || result.code === 20000) {
          this.$message.success("保存spu成功");
          this.$emit("update:isShowSpuForm", false);

          // 返回去之后得重新获取spu的分页列表数据
          this.$emit("successBack", spuInfo.id);

          // 清空子组件data当中所有的数据
          this.resetData();
        } else {
          // 失败干啥
          this.$message.error("保存spu失败");
        }
      } catch (error) {
        this.$message.error("请求保存spu失败");
      }
    },
    // 清空data数据
    resetData() {
      Object.assign(this._data, this.$options.data());
    },
    // 取消操作
    cancleBack() {
      this.$emit("update:isShowSpuForm", false);
      this.resetData();
    }
  },

  computed: {
    unUsedSaleAttrList() {
      //根据所有的销售属性列表和spu自己的销售属性列表计算剩余的销售属性列表
      return this.baseSaleAttrList.filter(item => {
        // 拿一项进来之后，我们要判断这一项的名字是不是和spu自己的销售属性列表当中所有项的名字都不一样，
        // 如果是，就要了
        return this.spuInfo.spuSaleAttrList.every(item1 => {
          return item1.saleAttrName !== item.name;
        });
      });
    }
  }
};
</script>

<style>
el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
