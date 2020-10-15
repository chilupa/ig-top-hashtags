import React from "react"
import { FaInstagram } from "react-icons/fa"
import FormikApp from "../components/FormComponent"
import "../styles/layout.scss"

const IndexPage = () => (
  <div className="Layout">
    <h1>
      <FaInstagram className="IGIcon" /> Top Hashtags
    </h1>
    <p>Type a hashtag and search. It results you top 20 hashtags.</p>
    <FormikApp />
  </div>
)

export default IndexPage
