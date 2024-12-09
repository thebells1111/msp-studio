<article>
	<h2>Not Your Hosting, Not Your Feed</h2>
	<h3>Why Bitcoin Podcasters and Musicians should consider self-hosting</h3>

	<h4>The Two Paths: Custodial vs Non-custodial Wallets</h4>
	<p>
		As a Bitcoiner, you may already know this, but for value 4 value Lightning payments, you need a
		hosted solution that is always connected to the internet so you can receive your sats at any
		time. There are several options, such as coinos, Wavlake or Fountain in which your wallet is
		held by others. These options are often the easiest, but rely on a degree of trust that the
		company won't close its doors and walk away with your sats. You can mitigate this risk by
		determining the amount you're comfortable with keeping on the custodial wallet before
		transferring the sats to your non-custodial wallet. This way, you'll never lose more than the
		amount being kept in someone else's wallet. This is by no means to disparage any of the
		custodial wallets. If you're looking for a recommendation, I think Fountain is probably the
		easiest.
	</p>
	<p>
		The other option is to take control of your own wallet, which is more difficult, because now you
		have to manage your own channels and are responsible for keeping track of your keys, but you
		maintain complete ownership of the wallet. There are solutions that allow you to keep your
		wallet on someone else's infrastructure, such as Voltage, or you can keep the wallet on your own
		infrastructure with a Raspberry Pi, Start 9, or even an old laptop stored in your bathroom. Even
		more amazing is with Alby Hub, you can connect your wallet with several apps to easily send
		payments. This is the most sovereign way, but with sovereignty comes responsibility.
	</p>
	<h4>RSS and Digital Sovereignty</h4>
	<p>
		As a Bitcoiner, you know the adage, “Not your keys, not your coins”. Well, the same applies to
		your RSS feed. I understand many of you think a podcast is something complicated, and you need a
		dedicated podcast hosting company to handle all the complicated stuff for you. And if you're a
		musician, you may not be the most tech savvy, because you were too busy learning the guitar and
		dating beautiful people and never messed around much with computers. The reality though, is RSS
		is simple, Really Simple. It allows you to Syndicate your content Simply, Really Simply, sort of
		like a Really Simple Syndication (RSS). I think we've forgotten that, and have offloaded our
		digital sovereignty to tech nerds and are willing to pay them $10 a month or 10% of what our
		fans send us for doing something we can do ourselves.
	</p>
	<p>
		Now I get it. I can change my own oil in my car. I just don't like to. I don't want to get the
		car up on block and crawl under it and get all oily, then have to dispose of the oil. It's a
		hassle, and I'll gladly pay someone else an extra $40 to avoid the hassle. But… I know how to
		change my own oil. I know what it is I'm paying for, and because of that, I can decide if my
		time is worth the dollars I have to pay. I see hosting your own feed the same way.
	</p>
	<p>
		So, you could pay a company to host your music, and they'll handle some of the more technical
		stuff for you. <a href="https://rssblue.com/blog/improved-pricing-for-short-episodes"
			>RSS Blue</a
		>
		has a great plan that starts at $6 a month, and
		<a href="https://www.wavlake.com/studio">Wavlake</a> makes it super easy for a 10% cut of your listener
		support. But much like changing your oil, if you know what's going on and how to do it yourself,
		you can decide if it's something you don't want to hassle with, or if it's something you're more
		than willing to spend the money on so you can focus on more important things in your life.
	</p>
	<h4>The Financial Aspect of Hosting</h4>
	<p>
		Hosting your own feed isn't free (although there are ‘free' ways to do it if you have a reliable
		internet connection and something like a Raspberry Pi or an old computer). You will need to pay
		for a hosting company to host your files. I like Digital Ocean for $5 a month, and even have a
		video tutorial on how easy it really is, but others are using a shared hosting solution through
		a company like DreamHost to host their website. If you're already hosting a WordPress website,
		uploading your mp3s and album art to your website makes a ton of sense, and you can host your
		podcast for no extra cost because you're already paying for your website. And really, all a
		podcast is, is some cover art, some mp3s, and an RSS feed that tells the apps where they can
		download your cover art and mp3s. If you can upload files to your email account, you can upload
		them to your server. (I'm going to let you in on a little secret, a server, and the cloud,
		they're just someone else's computer that has files that are always available to the internet.
		Your personal computer could just as easily be a server. This stuff is Really Simple, you just
		need someone to show you behind the curtain.)
	</p>
	<h4>RSS and Music: A New Paradigm</h4>
	<p>
		So what does this have to do with music. The Podcasting 2.0 community has been developing new
		items a podcaster can add to their RSS feed, things like a Lightning Wallet so now the apps have
		a place for listeners to send sats. It's just like a link to your mp3 file or artwork, this one
		just happens to be a link to your Lightning address. The RSS file (podcast feed), is again, just
		a file the apps can read that has a bunch of links and info for the apps to display to the
		listener. If you really want to peer behind the curtain, click on this link
		<a href="https://feeds.podcastindex.org/pc20.xml">https://feeds.podcastindex.org/pc20.xml</a> to
		view what a RSS feed really looks like. Although it looks technical, you can see there's a title
		for the podcast, and a bunch of items, which are the episodes, and an image with a link. It has all
		of the info an app needs to display and play the podcast. But, what if instead of episodes, we had
		songs, and instead of a podcast name, it was an album name? Could we use the same underlying tech
		to allow musicians to distribute their own music without a record industry, Spotify, or even BandCamp?
		If it works for podcasters, why couldn't it work for musicians? And that's where we are. By adding
		a new piece of information to the RSS feed, the apps can now determine if this should be displayed
		as a podcast or an album. Same technology, different application.
	</p>
	<h4>Do It Yourself with Music Side Project</h4>
	<p>
		But, you're musicians, you're used to booking your own gigs, hauling your own gear, selling your
		own merch, and sorting your own brown M&Ms. You should be hosting your own feed. And that's
		where Music Side Project comes in. It's a tool that helps you to build your feed. You could open
		a text document and copy and paste all of your own links into a RSS file, and it would work. In
		fact,
		<a href="https://github.com/de-mu/demu-feed-template"
			>Spencer Pearson has created a template feed</a
		> for just that, and it gives you the ultimate control. Music Side Project holds your hand a little
		more. It gives you a slick interface to copy and paste your info, and then automatically creates
		your RSS file to host on your own server. Then all you have to do is let the Podcast Index know where
		it can find your feed, and next thing you know, you have a published album your fans can listen to,
		and start sending your real money in real time as they're enjoying your music. And the best part
		is, Music Side Project is free. By default, I have Music Side Project as a 5% split in the value
		block, but that is entirely up to you, and you are free to reduce the amount or cut MSP out of the
		value exchange completely if you don't think it's very valuable. You determine how valuable my work
		is to you and how much you want to share to encourage me to continue working on the project. That's
		the beauty of value for value.
	</p>
</article>

<style>
	article {
		padding: 50px 32px 32px 32px;
	}

	h2 {
		font-weight: 600;
		margin: 0;
	}

	h3 {
		margin: 4px 0 16px 0;
	}

	p {
		margin: 4px 0;
	}

	h4 {
		margin: 8px 0;
		text-decoration: underline;
	}
</style>
