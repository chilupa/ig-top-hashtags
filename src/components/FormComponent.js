import React, { useState } from "react"
import { withFormik, Form } from "formik"
import * as Yup from "yup"
import axios from "axios"
import { FaSearch } from "react-icons/fa"
import { removeDuplicates } from "@chilupa/array-utils"
import { CircularProgress, TextField, Typography } from "@material-ui/core"
import { IoMdClipboard } from "react-icons/io"

const FormComponent = ({ values, errors, isSubmitting, status }) => {
  const [copySuccess, setCopySuccess] = useState("")

  const copyToClipBoard = async copyMe => {
    try {
      const trimmedArray = copyMe.map(word => word.trim())
      await navigator.clipboard.writeText(trimmedArray.join(" "))
      setCopySuccess("Copied!")
    } catch (err) {
      setCopySuccess("Failed to copy!")
    }
  }
  const handleInputChange = event => (values.hashtag = event.target.value)

  return (
    <div>
      <Form>
        <div className="container">
          <div>
            <div>
              <TextField
                label="#"
                variant="outlined"
                type="text"
                name="hashtag"
                onChange={handleInputChange}
              />
            </div>
            <div>
              {errors.hashtag && (
                <Typography component="p" variant="caption" color="error">
                  Please enter a hashtag
                </Typography>
              )}
            </div>
          </div>
          <div>
            <button className="SearchIcon" type="submit">
              <FaSearch />
            </button>
          </div>
        </div>
      </Form>

      {isSubmitting ? (
        <CircularProgress />
      ) : (
        <div>
          <p className="SearchResult">{values.hashtagSearchResult}</p>
          {values.hashtagSearchResult.length !== 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IoMdClipboard
                style={{ fontSize: "24px" }}
                onClick={() => copyToClipBoard(values.hashtagSearchResult)}
              />
              <span
                style={{
                  paddingLeft: "3px",
                  fontSize: "16px",
                }}
              >
                {copySuccess}
              </span>
            </div>
          )}
        </div>
      )}
      {status?.apiError && (
        <div>
          <p className="error">Something went wrong. Please try agian.</p>
        </div>
      )}
    </div>
  )
}

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
  async handleSubmit(values, { setSubmitting, setStatus }) {
    setSubmitting(true)
    setStatus({ apiError: false })
    const { hashtag } = values

    let url = "https://www.instagram.com/explore/tags/" + hashtag + "/"

    const searchHashtags = htmlData => {
      const regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/gm
      let matches = []
      let match
      while ((match = regex.exec(htmlData))) {
        matches.push(match[1])
      }
      return matches
    }

    await axios.get(url).then(
      ({ data }) => {
        const hashtags = searchHashtags(data)
        values.hashtagSearchResult = removeDuplicates(hashtags)
          .slice(0, 20)
          .map(hashtag => `#${hashtag} `)
        setStatus({ apiError: false })
      },
      err => {
        setStatus({ apiError: true })
      }
    )

    setSubmitting(false)
  },
})(FormComponent)

export default FormikApp
