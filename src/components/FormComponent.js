import React from "react"
import { withFormik, Form, Field } from "formik"
import * as Yup from "yup"
import axios from "axios"
import { FaSearch } from "react-icons/fa"

const FormComponent = ({ values, errors }) => (
  <div>
    <Form>
      <label># </label>
      <Field className="HashtagInput" type="text" name="hashtag" />
      <button className="SearchBtn" type="submit">
        <FaSearch />
      </button>
      <small>
        {errors.hashtag && (
          <p className="ErrorMessage">You must enter a Hashtag</p>
        )}
      </small>
    </Form>
    <p className="SearchResult">{values.hashtagSearchResult}</p>
  </div>
)

const FormikApp = withFormik({
  mapPropsToValues() {
    return {
      hashtag: "",
      hashtagSearchResult: [],
    }
  },
  validationSchema: Yup.object().shape({
    hashtag: Yup.string().required(),
  }),
  async handleSubmit(values, { setSubmitting }) {
    setSubmitting(true)
    let hashtag = values.hashtag
    let url = "https://www.instagram.com/explore/tags/" + hashtag + "/"
    const searchHashtags = htmlData => {
      let regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/gm
      let matches = []
      let match
      while ((match = regex.exec(htmlData))) {
        matches.push(match[1])
      }
      return matches
    }

    const removeDuplicates = arr => {
      let newArr = []
      let tags = []
      arr.map(ele => {
        if (newArr.indexOf(ele) === -1) {
          newArr.push(ele)
        }
      })
      for (let i = 0; i < 20; i++) {
        tags.push(newArr[i])
      }
      return tags
    }

    const c = await axios.get(url)
    let hts = searchHashtags(c.data)
    let ht = removeDuplicates(hts)
    let hashtagResult = ht.map(ele => "#" + ele + " ")
    values.hashtagSearchResult = hashtagResult

    setSubmitting(false)
  },
})(FormComponent)

export default FormikApp
