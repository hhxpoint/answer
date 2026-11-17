// packageTech/components/skeleton/skeleton.js
Component({
  properties: {
    loading: {
      type: Boolean,
      value: true
    },
    rows: {
      type: Number,
      value: 5
    }
  },

  data: {
    skeletonRows: []
  },

  lifetimes: {
    attached() {
      this.generateRows()
    }
  },

  methods: {
    generateRows() {
      const rows = []
      for (let i = 0; i < this.properties.rows; i++) {
        rows.push(i)
      }
      this.setData({ skeletonRows: rows })
    }
  }
})
