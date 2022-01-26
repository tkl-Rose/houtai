/<template>
  <div>
    <!--头部分类全局组件-->
    <el-card>
      <CategorySelector
        @changeCategory="changeCategory"
        :isShowList="isShowList"
      ></CategorySelector>
    </el-card>

    <el-card style="margin-top:20px">
      <!--这是spu列表的界面-->
      <div v-show="!isShowSpuForm && !isShowSkuForm">
        <el-button
          @click="showAddSpuForm"
          :disabled="!category3Id"
          type="primary"
          icon="el-icon-plus"
          >添加SPU</el-button
        >

        <el-table :data="spuList" border style="width: 100%">
          <el-table-column align="center" type="index" label="序号" width="80">
          </el-table-column>

          <el-table-column width="width" prop="spuName" label="SPU名称">
          </el-table-column>

          <el-table-column width="width" prop="description" label="SPU描述">
          </el-table-column>

          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <HintButton
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="showAddSkuForm(row)"
              ></HintButton>
              <HintButton
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="showUpdateSpuForm(row)"
              ></HintButton>
              <HintButton
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看spu的sku列表"
              ></HintButton>

              <el-popconfirm>
                <HintButton
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <!--分页器-->
        <el-pagination
          background
          style="text-align:center"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
          :current-page="page"
          :page-size="limit"
          :total="total"
          :pager-count="5"
          :page-sizes="[2, 5, 7]"
          layout="prev, pager, next, jumper,->,sizes,total"
        >
        </el-pagination>
      </div>

      <!--这个是spu的添加或者修改界面-->
      <SpuForm
        ref="spu"
        v-show="isShowSpuForm"
        :isShowSpuForm.sync="isShowSpuForm"
      ></SpuForm>
      <SkuForm v-show="isShowSkuForm"></SkuForm>
    </el-card>
  </div>
</template>

<script>
import SpuForm from "@/views/product/spu/components/SpuForm";
import SkuForm from "@/views/product/spu/components/SkuForm";
export default {
  name: "spu",
  components: {
    SpuForm,
    SkuForm
  },
  data() {
    return {
      isShowList: true,
      category1Id: "",
      category2Id: "",
      category3Id: "",
      spuList: [],

      page: 1,
      limit: 2,
      total: 0,

      //下面控制三个页面的切换
      isShowSpuForm: false,
      isShowSkuForm: false
    };
  },
  methods: {
    changeCategory({ categoryId, level }) {
      if (level === 1) {
        this.spuList = [];
        this.category2Id = "";
        this.category3Id = "";
        this.category1Id = categoryId;
      } else if (level === 2) {
        this.spuList = [];
        this.category3Id = "";
        this.category2Id = categoryId;
      } else {
        this.category3Id = categoryId;
        this.getSpuList();
      }
    },
    // 获取spu的分页列表
    async getSpuList(pager = 1) {
      this.page = pager;
      let { page, limit, category3Id } = this;
      try {
        const result = await this.$API.spu.getList(page, limit, category3Id);
        if (result.code === 200 || result.code === 20000) {
          this.spuList = result.data.records;
          this.total = result.data.total;
        } else {
          this.$message.error("获取spu列表失败");
        }
      } catch (error) {
        this.$message.error("请求获取spu列表失败");
      }
    },
    // 切换每页数量
    handleSizeChange(size) {
      this.limit = size;
      this.getSpuList();
    },

    //点击添加spu的按钮
    showAddSpuForm() {
      this.isShowSpuForm = true;
      this.$refs.spu.getInitAddSpuFormData(this.category3Id);
    },

    //点击修改spu的按钮
    showUpdateSpuForm(row) {
      this.isShowSpuForm = true;
      this.$refs.spu.getInitUpdateSpuFormData(row, this.category3Id);
    },
    //点击添加sku的按钮
    showAddSkuForm(row) {
      this.isShowSkuForm = true;
      this.$refs.sku.getInitAddSkuFormData(
        row,
        this.category1Id,
        this.category2Id
      );
    }
  }
};
</script>

<style></style>
