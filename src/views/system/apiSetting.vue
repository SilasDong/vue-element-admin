<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="Api名称" v-model="listQuery.api_name">
      </el-input>

      <el-select clearable style="width: 90px" class="filter-item" v-model="listQuery.sql_type" placeholder="语句类型">
        <el-option v-for="item in sqlTypeOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>


      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="Api名称" width="165">
        <template scope="scope">
          <span>{{scope.row.API_NAME}}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="sql语句">
        <template scope="scope">
          <span class="link-type" @click='showContent(scope.row.SQL_TEXT)'>{{scope.row.SQL_TEXT|substring(10)}}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="二级关系">
        <template scope="scope">
          <span class="link-type" @click='showContent(scope.row.LEVEL_RELATION, true)'>{{scope.row.LEVEL_RELATION|substring(10)}}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" label="参数">
        <template scope="scope">
          <span class="link-type" @click='showContent(scope.row.PARAMS, true)'>{{scope.row.PARAMS|substring(10)}}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="语句类型">
        <template scope="scope">
          <el-tag  type="primary">{{scope.row.SQL_TYPE|sqlType}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="登录认证">
        <template scope="scope">
          <el-switch on-color="#13ce66" off-color="#ff4949" on-text="ON" off-text="OFF" on-value="1"
            off-value="0" v-model="scope.row.IS_NEED_LOGIN"></el-switch>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="是否启用">
        <template scope="scope">
          <el-switch on-color="#13ce66" off-color="#ff4949"  on-text="ON" off-text="OFF" on-value="1" off-value="0" v-model="scope.row.ISENABLE"></el-switch>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="是否分页">
        <template scope="scope">
          <el-switch on-color="#13ce66" off-color="#ff4949"  on-text="ON" off-text="OFF" on-value="1" off-value="0" v-model="scope.row.IS_PAGING"></el-switch>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="数据类型">
        <template scope="scope">
          <el-switch on-color="#13ce66" off-color="#ff4949" on-text="数组" off-text="对象" on-value="1" off-value="2" v-model="scope.row.DATA_TYPE"></el-switch>
        </template>
      </el-table-column>

      <el-table-column align="center" label="备注" min-width="100px">
        <template scope="scope">
          <span>{{scope.row.REMARKS}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!--<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="small-space" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="类型">
          <el-select class="filter-item" v-model="temp.type" placeholder="请选择">
            <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-select class="filter-item" v-model="temp.status" placeholder="请选择">
            <el-option v-for="item in  statusOptions" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="时间">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="标题">
          <el-input v-model="temp.title"></el-input>
        </el-form-item>

        <el-form-item label="重要性">
          <el-rate style="margin-top:8px;" v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']"></el-rate>
        </el-form-item>

        <el-form-item label="点评">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="temp.remark">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
        <el-button v-else type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>-->

    <el-dialog title="完整内容" :visible.sync="dialogContent.visible" size="small">
      <el-form>
        <el-form-item>
          <el-input type="textarea" v-model="dialogContent.data" :autosize="{ minRows: 2, maxRows: 13}"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogContent.visible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import {
    getApiList
  } from 'api/system';


  export default {
    name: 'apiSetting',
    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          api_name: undefined,
          sql_type: undefined
        },
        temp: {
          id: undefined,
          importance: 0,
          remark: '',
          timestamp: 0,
          title: '',
          type: '',
          status: 'published'
        },
        sqlTypeOptions: [{ value: 1, label: 'select' }, { value: 2, label: 'add' }, { value: 3, label: 'update' }, { value: 4, label: 'delete' }],
        sortOptions: [{
          label: '按ID升序列',
          key: '+id'
        }, {
          label: '按ID降序',
          key: '-id'
        }],
        statusOptions: ['published', 'draft', 'deleted'],
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        dialogContent: {
          visible: false,
          data: ''
        },
        pvData: [],
        showAuditor: false,
        tableKey: 0
      }
    },
    created() {
      this.getList();
    },
    filters: {
      sqlType(type) {
        const statusMap = ['select', 'add', 'update', 'delete'];
        return statusMap[type - 1]
      }
    },
    methods: {
      getList() {
        this.listLoading = true;
        getApiList(this.listQuery).then(response => {
          const data = response.data;
          this.list = data.value || [];
          this.total = data.count;
          this.listLoading = false;
        })
      },
      handleFilter() {
        this.getList();
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      timeFilter(time) {
        if (!time[0]) {
          this.listQuery.start = undefined;
          this.listQuery.end = undefined;
          return;
        }
        this.listQuery.start = parseInt(+time[0] / 1000);
        this.listQuery.end = parseInt((+time[1] + 3600 * 1000 * 24) / 1000);
      },
      handleModifyStatus(row, status) {
        this.$message({
          message: '操作成功',
          type: 'success'
        });
        row.status = status;
      },
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row);
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
      },
      handleDelete(row) {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        });
        const index = this.list.indexOf(row);
        this.list.splice(index, 1);
      },
      create() {
        this.temp.id = parseInt(Math.random() * 100) + 1024;
        this.temp.timestamp = +new Date();
        this.temp.author = '原创作者';
        this.list.unshift(this.temp);
        this.dialogFormVisible = false;
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        });
      },
      update() {
        this.temp.timestamp = +this.temp.timestamp;
        for (const v of this.list) {
          if (v.id === this.temp.id) {
            const index = this.list.indexOf(v);
            this.list.splice(index, 1, this.temp);
            break;
          }
        }
        this.dialogFormVisible = false;
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        });
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          importance: 0,
          remark: '',
          timestamp: 0,
          title: '',
          status: 'published',
          type: ''
        };
      },
      showContent(content, toJson = false) {
        if (toJson) {
          this.dialogContent.data = JSON.stringify(JSON.parse(content.replace(/'/g, '"')), undefined, 4);
        } else {
          this.dialogContent.data = content;
        }
        this.dialogContent.visible = true;
        console.log(this.dialogContent.data)
      },
      handleDownload() {
        require.ensure([], () => {
          const {
            export_json_to_excel
          } = require('vendor/Export2Excel');
          const tHeader = ['时间', '地区', '类型', '标题', '重要性'];
          const filterVal = ['timestamp', 'province', 'type', 'title', 'importance'];
          const data = this.formatJson(filterVal, this.list);
          export_json_to_excel(tHeader, data, 'table数据');
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      }
    }
  }
</script>